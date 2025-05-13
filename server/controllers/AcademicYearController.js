import AcademicYear from "../models/AcademicYear.js";
import Semester from "../models/Semester.js";
import Period from "../models/Period.js";
import {
  validateAcademicYearInput,
  validateSemesterInput,
  validateAcademicPeriodInput,
} from "../validators/AcademicYearValidator.js";

//data de inceput trebuie sa fie inaintea datei de sfarsit
//anul universitar nou nu trebuie sa se suprapuna cu cei existenti
//nume unic si obligatoriu
export const createAcademicYear = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    const validationError = await validateAcademicYearInput({
      name,
      startDate,
      endDate,
    });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }

    const year = await AcademicYear.create({
      name,
      startDate,
      endDate,
    });
    res.status(201).json({ uuid: year.uuid });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//campuri obligatorii
//ordinea datelor
//incadrare in an universitar
//sa nu se suprapuna semestrele
export const createSemester = async (req, res) => {
  const { name, startDate, endDate, idAcademicYear } = req.body;
  try {
    const validationError = await validateSemesterInput({
      name,
      startDate,
      endDate,
      idAcademicYear,
    });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
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

//validare date obligatorii si ordine date
//tipul perioadei
//existenta anului universitar
//data de inceput trebuie sa fie inaintea datei de sfarsit
//daca nu exista semestru se valideaza vacanta intersemestriala
//vacantele nu trebuie sa se suprapuna
export const createPeriod = async (req, res) => {
  try {
    const { startDate, endDate, idSemester, idAcademicYear, type } = req.body;

    const validationError = await validateAcademicPeriodInput({
      startDate,
      endDate,
      idAcademicYear,
      idSemester,
      type,
    });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }

    await Period.create({
      startDate,
      endDate,
      idSemester: idSemester || null,
      idAcademicYear,
      type,
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
