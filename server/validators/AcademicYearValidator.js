import { Op } from "sequelize";
import Semester from "../models/Semester.js";
import Period from "../models/Period.js";

export function validatePeriodInput({ startDate, endDate, idAcademicYear }) {
  if (!idAcademicYear) return "An academic year must be specified!";
  if (!startDate || !endDate) return "Both dates must be specified";
  if (new Date(startDate) >= new Date(endDate))
    return "Start date must be before end date";
  return null;
}

export async function validateSemesterPeriod(idSemester, startDate, endDate) {
  const semester = await Semester.findOne({ where: { uuid: idSemester } });
  if (!semester) return { code: 404, message: "Semestrul nu există!" };

  if (
    new Date(startDate) < new Date(semester.startDate) ||
    new Date(endDate) > new Date(semester.endDate)
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

  const requiredStart = addDays(firstSemester.endDate, 1);
  const requiredEnd = addDays(secondSemester.startDate, -1);

  if (
    new Date(startDate).toISOString().slice(0, 10) !==
    requiredStart.toISOString().slice(0, 10)
  ) {
    return {
      code: 400,
      message: `Vacanța intersemestrială trebuie să înceapă pe ${requiredStart
        .toISOString()
        .slice(0, 10)}!`,
    };
  }

  if (
    new Date(endDate).toISOString().slice(0, 10) !==
    requiredEnd.toISOString().slice(0, 10)
  ) {
    return {
      code: 400,
      message: `Vacanța intersemestrială trebuie să se termine pe ${requiredEnd
        .toISOString()
        .slice(0, 10)}!`,
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
