import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";

export const getActivityEnrollments = async (req, res) => {
  const response = await Enrollment.findAll({
    where: {
      idActivity: req.params.idActivity,
    },
    include: {
      model: Student,
      attributes: ["uuid", "name", "email"],
    },
  });
  const students = response.map((enrollment) => enrollment.student);
  res.status(200).json(students);
  try {
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createEnrollment = async (req, res) => {
  const { idStudent, idActivity } = req.body;
  try {
    const existingEnrollment = await Enrollment.findOne({
      where: {
        idStudent: idStudent,
        idActivity: idActivity,
      },
    });
    if (existingEnrollment) {
      return res.status(409).json({ msg: "Student enrolled" });
    }
    await Enrollment.create({
      idStudent: idStudent,
      idActivity: idActivity,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
