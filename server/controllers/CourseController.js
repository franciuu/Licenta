import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  try {
    const response = await Course.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getCourseById = async (req, res) => {
  try {
    const response = await Course.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!response) {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createCourse = async (req, res) => {
  const { name, program } = req.body;
  try {
    await Course.create({
      name: name,
      programLevel: program,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { uuid: req.params.id },
    });
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    await course.destroy();
    res.status(200).json({ msg: "Course deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
