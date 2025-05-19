import { Op } from "sequelize";

import Activity from "../models/Activity.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Semester from "../models/Semester.js";
import AcademicYear from "../models/AcademicYear.js";
import Period from "../models/Period.js";
import { getActivityDates } from "../utils/dateUtils.js";
import { validateActivityInput } from "../validators/ActivityValidator.js";

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
          attributes: ["uuid", "startDate", "endDate"],
        },
      ],
    });
    const semesterIds = response.map((a) => a.semester?.uuid);

    const periods = await Period.findAll({
      where: {
        idSemester: { [Op.in]: semesterIds },
      },
      attributes: ["startDate", "endDate"],
    });
    const excludedPeriods = periods.map((p) => ({
      startDate: p.startDate,
      endDate: p.endDate,
    }));

    const result = response.map((activity) => {
      const raw = activity.toJSON();
      const availableDates = getActivityDates(
        raw.semester?.startDate,
        raw.semester?.endDate,
        raw.dayOfWeek,
        excludedPeriods
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
          attributes: ["uuid", "name", "startDate", "endDate"],
          include: [
            {
              model: AcademicYear,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    const raw = response.toJSON();
    const semesterId = raw.semester?.uuid;
    if (!semesterId) {
      return res.status(400).json({ msg: "Semester information missing" });
    }
    const periods = await Period.findAll({
      where: {
        idSemester: semesterId,
        type: { [Op.in]: ["vacation", "exams"] },
      },
      attributes: ["startDate", "endDate"],
    });
    const excludedPeriods = periods.map((p) => ({
      startDate: p.startDate,
      endDate: p.endDate,
    }));
    const dates = getActivityDates(
      raw.semester.startDate,
      raw.semester.endDate,
      raw.dayOfWeek,
      excludedPeriods
    );

    const formatted = {
      ...raw,
      availableDates: dates,
    };

    return res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createActivity = async (req, res) => {
  const {
    name,
    startTime,
    endTime,
    idRoom,
    idCourse,
    idProf,
    dayOfWeek,
    idSemester,
    type,
  } = req.body;
  try {
    const validationError = await validateActivityInput({
      name,
      startTime,
      endTime,
      idRoom,
      idCourse,
      idProf,
      dayOfWeek,
      idSemester,
      type,
    });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }

    await Activity.create({
      name,
      startTime,
      endTime,
      idRoom,
      idCourse,
      idProf,
      dayOfWeek,
      idSemester,
      type,
    });
    res.status(201).json({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      where: { uuid: req.params.id },
    });
    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }
    await activity.destroy();
    res.status(200).json({ msg: "Activity deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
