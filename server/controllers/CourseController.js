import Course from "../models/Course.js";
import Activity from "../models/Activity.js";
import { validateCourseInput } from "../validators/CourseValidator.js";

export const createCourse = async (req, res) => {
  const { name, program } = req.body;
  try {
    const validationError = await validateCourseInput({ name, program });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }

    await Course.create({
      name,
      programLevel: program,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPersonalCourses = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      where: { idProf: req.user },
      include: [
        {
          model: Course,
          attributes: ["uuid", "name"],
        },
      ],
      attributes: [],
    });

    const coursesMap = new Map();
    activities.forEach((activity) => {
      if (activity.course && !coursesMap.has(activity.course.uuid)) {
        coursesMap.set(activity.course.uuid, activity.course);
      }
    });

    const courses = Array.from(coursesMap.values());
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
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
