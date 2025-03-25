import Student from "../models/Student.js";
import Activity from "../models/Activity.js";
import Enrollment from "../models/Enrollment.js";
import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";
import { Op } from "sequelize";

export const getStudents = async (req, res) => {
  try {
    const response = await Student.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPersonalStudents = async (req, res) => {
  try {
    const idProf = req.user;

    const activities = await Activity.findAll({
      where: { idProf: idProf },
      attributes: ["uuid"],
    });

    const idActivities = activities.map((a) => a.uuid);

    if (idActivities.length === 0) {
      return res.status(200).json({ studenti: [] });
    }

    const enrollments = await Enrollment.findAll({
      where: {
        idActivity: {
          [Op.in]: idActivities,
        },
      },
      attributes: ["idStudent"],
    });

    const idStudents = [...new Set(enrollments.map((e) => e.idStudent))];

    const students = await Student.findAll({
      where: {
        uuid: {
          [Op.in]: idStudents,
        },
      },
    });

    return res.status(200).json({
      students: students,
      count: students.length,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const response = await Student.findOne({
      where: {
        uuid: req.params.id,
      },
      include: { model: Image, attributes: ["imageUrl"] },
    });
    if (response) {
      return res.status(200).json(response);
    }
    res.status(404).json({ msg: "Student not found" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getStudentByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const trimmedEmail = email?.trim().toLowerCase();
    const response = await Student.findOne({
      where: {
        email: trimmedEmail,
      },
    });
    if (response) {
      return res.status(200).json(response);
    }
    res.status(404).json({ msg: "Student not found" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createStudent = async (req, res) => {
  const { name, birthDate, email, studyYear, images } = req.body;

  try {
    const newStudent = await Student.create({
      name: name,
      birthDate: birthDate,
      email: email,
      studyYear: studyYear,
    });

    console.log(req.body);
    let uploadedImages = images.map((imageUrl) => ({
      idStudent: newStudent.uuid,
      imageUrl: imageUrl,
    }));

    await Image.bulkCreate(uploadedImages);
    res.status(201).json({ msg: "Sucessful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateStudent = async (req, res) => {
  const { name, birthDate, email, studyYear, images } = req.body;
  const student = await Student.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!student) {
    res.status(404).json({ msg: "Student not found" });
  }
  try {
    await student.update({
      name: name,
      birthDate: birthDate,
      email: email,
      studyYear: studyYear,
    });

    let uploadedImages = images.map((imageUrl) => ({
      idStudent: student.uuid,
      imageUrl: imageUrl,
    }));

    await Image.bulkCreate(uploadedImages);
    res.status(200).json({ msg: "Student updated" });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { uuid: req.params.id },
    });
    if (!student) {
      res.status(404).json({ msg: "Student not found" });
    }

    const images = await Image.findAll({ where: { idStudent: student.uuid } });
    for (const img of images) {
      const urlArray = img.imageUrl.split("/");
      const image = urlArray[urlArray.length - 1];
      const imageName = image.split(".")[0];
      await cloudinary.uploader.destroy(`students/${imageName}`);
    }
    await student.destroy();
    res.status(200).json({ msg: "Student deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
