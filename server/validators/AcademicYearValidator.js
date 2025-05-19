import { Op } from "sequelize";
import AcademicYear from "../models/AcademicYear.js";
import Semester from "../models/Semester.js";
import Period from "../models/Period.js";
import { parseISO, isBefore, isAfter, addDays, format } from "date-fns";

export async function validateAcademicYearInput({ name, startDate, endDate }) {
  if (!name) {
    return {
      code: 400,
      message: "The name of the academic year is mandatory.",
    };
  }
  if (!startDate || !endDate) {
    return {
      code: 400,
      message: "Both dates must be specified.",
    };
  }
  if (!isBefore(parseISO(startDate), parseISO(endDate)))
    return {
      code: 400,
      message: "The start date must be before the end date.",
    };

  const existing = await AcademicYear.findOne({ where: { name } });
  if (existing) {
    return {
      code: 400,
      message: "There is already an academic year with this name.",
    };
  }

  const overlaping = await AcademicYear.findOne({
    where: {
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] },
        },
        {
          endDate: { [Op.between]: [startDate, endDate] },
        },
        {
          startDate: { [Op.lte]: startDate },
          endDate: { [Op.gte]: endDate },
        },
      ],
    },
  });
  if (overlaping) {
    return {
      code: 409,
      message:
        "The academic year interval overlaps with another existing academic year.",
    };
  }
  return null;
}

export async function validateSemesterInput({
  name,
  startDate,
  endDate,
  idAcademicYear,
}) {
  if (!name) {
    return {
      code: 400,
      message: "The semester name is required.",
    };
  }
  if (!startDate || !endDate) {
    return {
      code: 400,
      message: "Both dates must be specified.",
    };
  }
  if (!idAcademicYear) {
    return {
      code: 400,
      message: "The academic year must be specified.",
    };
  }

  if (!isBefore(parseISO(startDate), parseISO(endDate))) {
    return {
      code: 400,
      message: "The start date must be before the end date.",
    };
  }

  const academicYear = await AcademicYear.findByPk(idAcademicYear);
  if (!academicYear) {
    return {
      code: 404,
      message: "The academic year does not exist.",
    };
  }

  if (
    parseISO(startDate) < parseISO(academicYear.startDate) ||
    parseISO(endDate) > parseISO(academicYear.endDate)
  ) {
    return {
      code: 400,
      message: "The semester must be within the academic year.",
    };
  }

  const overlapping = await Semester.findOne({
    where: {
      idAcademicYear,
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] },
        },
        {
          endDate: { [Op.between]: [startDate, endDate] },
        },
        {
          startDate: { [Op.lte]: startDate },
          endDate: { [Op.gte]: endDate },
        },
      ],
    },
  });
  if (overlapping) {
    return {
      code: 409,
      message: "The semester interval overlaps with another existing semester.",
    };
  }
  return null;
}

export async function validateAcademicPeriodInput({
  startDate,
  endDate,
  idAcademicYear,
  idSemester,
  type,
}) {
  if (!idAcademicYear) {
    return {
      code: 400,
      message: "Academic year must be specified.",
    };
  }
  if (!startDate || !endDate) {
    return {
      code: 400,
      message: "Both dates must be specified.",
    };
  }
  if (!isBefore(parseISO(startDate), parseISO(endDate))) {
    return {
      code: 400,
      message: "The start date must be before the end date.",
    };
  }

  const allowedTypes = ["vacation", "exams"];
  if (!allowedTypes.includes(type)) {
    return { code: 400, message: "The period type is not valid." };
  }

  const academicYear = await AcademicYear.findByPk(idAcademicYear);
  if (!academicYear) {
    return { code: 404, message: "The academic year does not exist." };
  }

  if (idSemester) {
    const semester = await Semester.findOne({
      where: {
        uuid: idSemester,
      },
    });
    if (!semester) {
      return { code: 404, message: "The semester doesn't exist." };
    }
    if (
      isBefore(parseISO(startDate), parseISO(semester.startDate)) ||
      isAfter(parseISO(endDate), parseISO(semester.endDate))
    ) {
      return {
        code: 400,
        message: "The period must be within the semester!",
      };
    }
  } else {
    const semesters = await Semester.findAll({
      where: { idAcademicYear },
      order: [["startDate", "ASC"]],
    });
    if (semesters.length !== 2) {
      return {
        code: 400,
        message: "Exactly 2 semesters are needed for the midterm break!",
      };
    }
    const [firstSemester, secondSemester] = semesters;

    const requiredStart = addDays(parseISO(firstSemester.endDate), 1);
    const requiredEnd = addDays(parseISO(secondSemester.startDate), -1);

    if (startDate !== format(requiredStart, "yyyy-MM-dd")) {
      return {
        code: 400,
        message: `The semester break must begin on ${format(
          requiredStart,
          "yyyy-MM-dd"
        )}!`,
      };
    }
    if (endDate !== format(requiredEnd, "yyyy-MM-dd")) {
      return {
        code: 400,
        message: `The semester break must end on ${format(
          requiredEnd,
          "yyyy-MM-dd"
        )}!`,
      };
    }
  }

  const where = {
    idAcademicYear,
    [Op.or]: [
      { startDate: { [Op.between]: [startDate, endDate] } },
      { endDate: { [Op.between]: [startDate, endDate] } },
      {
        startDate: { [Op.lte]: startDate },
        endDate: { [Op.gte]: endDate },
      },
    ],
  };

  const overlapping = await Period.findOne({ where });
  if (overlapping) {
    return {
      code: 409,
      message: "The period overlaps with another existing period.",
    };
  }
  return null;
}
