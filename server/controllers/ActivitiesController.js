import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import AcademicYear from "../models/AcademicYear.js";
import { getActivityDates } from "../utils/dateUtils.js";

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

export const getLectures = async (req, res) => {
  try {
    const response = await Activity.findAll({
      where: {
        idProf: req.user,
        type: "lecture",
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
      include: [
        {
          model: Semester,
          attributes: ["startDate", "endDate"],
        },
      ],
    });

    const result = response.map((activity) => {
      const raw = activity.toJSON();
      const availableDates = getActivityDates(
        raw.semester?.startDate,
        raw.semester?.endDate,
        raw.dayOfWeek
      );
      return {
        ...raw,
        availableDates,
      };
    });

    res.status(200).json({ activities: result, count: result.length });
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
        {
          model: Semester,
          attributes: ["name", "startDate", "endDate"],
          include: [
            {
              model: AcademicYear,
              attributes: ["name"],
            },
          ],
        },
      ],
    });
    if (response) {
      const raw = response.toJSON();

      const dates = getActivityDates(
        raw.semester?.startDate,
        raw.semester?.endDate,
        raw.dayOfWeek
      );

      const formatted = {
        ...raw,
        availableDates: dates,
      };
      return res.status(200).json(formatted);
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
    type,
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
      type: type,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
