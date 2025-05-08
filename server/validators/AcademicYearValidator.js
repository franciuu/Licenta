import { Op } from "sequelize";
import Semester from "../models/Semester.js";
import Period from "../models/Period.js";
import { parseISO, isBefore, isAfter, addDays, format } from "date-fns";

export function validatePeriodInput({ startDate, endDate, idAcademicYear }) {
  if (!idAcademicYear) return "An academic year must be specified!";
  if (!startDate || !endDate) return "Both dates must be specified";
  if (!isBefore(parseISO(startDate), parseISO(endDate)))
    return "Start date must be before end date";
  return null;
}

export async function validateSemesterPeriod(idSemester, startDate, endDate) {
  const semester = await Semester.findOne({ where: { uuid: idSemester } });
  if (!semester) return { code: 404, message: "Semestrul nu există!" };

  if (
    isBefore(parseISO(startDate), parseISO(semester.startDate)) ||
    isAfter(parseISO(endDate), parseISO(semester.endDate))
  ) {
    return {
      code: 400,
      message: "Perioada trebuie să fie în intervalul semestrului!",
    };
  }
  return null;
}

export async function validateIntersemesterPeriod(
  idAcademicYear,
  startDate,
  endDate
) {
  const semesters = await Semester.findAll({
    where: { idAcademicYear },
    order: [["startDate", "ASC"]],
  });
  if (semesters.length !== 2) {
    return {
      code: 400,
      message:
        "Sunt necesare exact 2 semestre pentru vacanța intersemestrială!",
    };
  }
  const [firstSemester, secondSemester] = semesters;

  const requiredStart = addDays(parseISO(firstSemester.endDate), 1);
  const requiredEnd = addDays(parseISO(secondSemester.startDate), -1);

  if (startDate !== format(requiredStart, "yyyy-MM-dd")) {
    return {
      code: 400,
      message: `Vacanța intersemestrială trebuie să înceapă pe ${format(
        requiredStart,
        "yyyy-MM-dd"
      )}!`,
    };
  }

  if (endDate !== format(requiredEnd, "yyyy-MM-dd")) {
    return {
      code: 400,
      message: `Vacanța intersemestrială trebuie să se termine pe ${format(
        requiredEnd,
        "yyyy-MM-dd"
      )}!`,
    };
  }
  return null;
}

export async function isPeriodOverlapping({
  startDate,
  endDate,
  idAcademicYear,
}) {
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
  return !!overlapping;
}
