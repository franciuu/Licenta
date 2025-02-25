import Student from "../models/Student.js";
import Image from "../models/Image.js";
import cloudinary from "../config/cloudinary.js";

export const getStudents = async (req, res) => {
  try {
    const response = await Student.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createStudent = async (req, res) => {
  const { name, date, email, year, images } = req.body;

  try {
    const newStudent = await Student.create({
      name: name,
      birthDate: date,
      email: email,
      studyYear: year,
    });

    let uploadedImages = images.map((imageUrl) => ({
      idStudent: newStudent.uuid,
      imageUrl: imageUrl,
    }));

    await Image.bulkCreate(uploadedImages);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
