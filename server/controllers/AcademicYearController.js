import AcademicYear from "../models/AcademicYear.js";
import Semester from "../models/Semester.js";

export const createAcademicYear = async (req, res) => {
  const { name, startDate, endDate } = req.body;
  try {
    await AcademicYear.create({
      name: name,
      startDate: startDate,
      endDate: endDate,
    });
    res.status(201).json({ msg: "Successful" });
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

export const getAcademicYears = async (req, res) => {
  try {
    const response = await AcademicYear.findAll({
      include: {
        model: Semester,
      },
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
