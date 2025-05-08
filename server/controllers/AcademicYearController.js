import AcademicYear from "../models/AcademicYear.js";
import Semester from "../models/Semester.js";
import Period from "../models/Period.js";
import {
  validatePeriodInput,
  validateSemesterPeriod,
  validateIntersemesterPeriod,
  isPeriodOverlapping,
} from "../validators/AcademicYearValidator.js";

export const createAcademicYear = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    const year = await AcademicYear.create({
      name: name,
      startDate: startDate,
      endDate: endDate,
    });
    res.status(201).json({ uuid: year.uuid });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSemester = async (req, res) => {
  const { name, startDate, endDate, idAcademicYear } = req.body;
  try {
    await Semester.create({
      name: name,
      startDate: startDate,
      endDate: endDate,
      idAcademicYear: idAcademicYear,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPeriod = async (req, res) => {
  try {
    const { type, startDate, endDate, idSemester, idAcademicYear } = req.body;

    const inputError = validatePeriodInput({
      startDate,
      endDate,
      idAcademicYear,
    });
    if (inputError) return res.status(400).json({ msg: inputError });

    let validationError = null;
    if (idSemester) {
      validationError = await validateSemesterPeriod(
        idSemester,
        startDate,
        endDate
      );
    } else {
      validationError = await validateIntersemesterPeriod(
        idAcademicYear,
        startDate,
        endDate
      );
    }
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }
    const overlap = await isPeriodOverlapping({
      startDate,
      endDate,
      idAcademicYear,
    });
    if (overlap) {
      return res.status(400).json({
        msg: "Overlaps with another period",
      });
    }

    await Period.create({
      type,
      startDate,
      endDate,
      idSemester: idSemester || null,
      idAcademicYear,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAcademicYears = async (req, res) => {
  try {
    const response = await AcademicYear.findAll({
      include: {
        model: Semester,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSemesters = async (req, res) => {
  try {
    const response = await Semester.findAll({
      include: {
        model: AcademicYear,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
