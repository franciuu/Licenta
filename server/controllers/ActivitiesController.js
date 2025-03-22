import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

export const getCourseActivities = async (req, res) => {
  try {
    const response = await Activity.findAll({
      where: {
        idCourse: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPersonalActivities = async (req, res) => {
  try {
    const response = await Activity.findAll({
      where: {
        idProf: req.user,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getActivityById = async (req, res) => {
  try {
    const response = await Activity.findOne({
      where: {
        uuid: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });
    if (response) {
      return res.status(200).json(response);
    }
    res.status(404).json({ msg: "Activity not found" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createActivity = async (req, res) => {
  const {
    name,
    startTime,
    endTime,
    room,
    idCourse,
    idProf,
    dayOfWeek,
    idSemester,
  } = req.body;
  try {
    await Activity.create({
      name: name,
      startTime: startTime,
      endTime: endTime,
      room: room,
      idCourse: idCourse,
      idProf: idProf,
      dayOfWeek: dayOfWeek,
      idSemester: idSemester,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
