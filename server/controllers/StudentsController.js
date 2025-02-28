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
    const response = await Student.findOne({
      where: {
        uuid: req.params.id,
      },
      include: { model: Image, attributes: ["imageUrl"] },
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
    res.status(201).json({ msg: "Sucessful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
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
