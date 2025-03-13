import Enrollment from "../models/Enrollment.js";

export const getPersonalEnrollments = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createEnrollment = async (req, res) => {
  const { idStudent, id } = req.body;
  try {
    await Enrollment.create({
      idStudent: idStudent,
      id: id,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
