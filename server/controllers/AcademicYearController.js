import { parseISO, isBefore, isAfter } from "date-fns";

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
  console.log("Year: " + startDate);
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
    const year = await AcademicYear.findByPk(idAcademicYear);
    if (!year) {
      return res.status(404).json({ msg: "Academic year not found" });
    }

    if (startDate < year.startDate || endDate > year.endDate) {
      return res.status(400).json({
        msg: "Semester must be within the academic year boundaries",
      });
    }

    const semester = await Semester.create({
      name,
      startDate,
      endDate,
      idAcademicYear,
    });
    res.status(201).json({ uuid: semester.uuid });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPeriod = async (req, res) => {
  try {
    const { startDate, endDate, idSemester, idAcademicYear, type } = req.body;

    console.log("Controller " + startDate);
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
      startDate,
      endDate,
      idSemester: idSemester || null,
      idAcademicYear,
      type: type,
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
