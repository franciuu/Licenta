import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
  try {
    const response = await Course.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
