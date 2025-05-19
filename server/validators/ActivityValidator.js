import { Op } from "sequelize";

import Activity from "../models/Activity.js";
import Room from "../models/Room.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Semester from "../models/Semester.js";

export async function validateActivityInput({
  name,
  startTime,
  endTime,
  idRoom,
  idCourse,
  idProf,
  dayOfWeek,
  idSemester,
  type,
}) {
  if (!name) {
    return {
      code: 400,
      message: "Name must be specified.",
    };
  }
  if (!startTime || !endTime) {
    return {
      code: 400,
      message: "Both hours are mandatory.",
    };
  }
  if (!idRoom) {
    return {
      code: 400,
      message: "Room must be specified.",
    };
  }
  if (!idCourse) {
    return {
      code: 400,
      message: "Course must be specified.",
    };
  }
  if (!idProf) {
    return {
      code: 400,
      message: "Professor must be specified.",
    };
  }
  if (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6) {
    return {
      code: 400,
      message: "The day of the week is invalid.",
    };
  }
  if (!idSemester) {
    return {
      code: 400,
      message: "Semester must be specified.",
    };
  }
  const allowedTypes = ["lecture", "seminar"];
  if (!allowedTypes.includes(type)) {
    return { code: 400, message: "The activity type is invalid." };
  }

  const room = await Room.findByPk(idRoom);
  const professor = await User.findByPk(idProf);
  const course = await Course.findByPk(idCourse);
  const semester = await Semester.findByPk(idSemester);
  if (!room || !professor || !course || !semester) {
    return {
      code: 404,
      message: "Some entities do not exist.",
    };
  }

  const roomOverlapping = await Activity.findOne({
    where: {
      dayOfWeek,
      idRoom,
      idSemester,
      [Op.and]: [
        { startTime: { [Op.lt]: endTime } },
        { endTime: { [Op.gt]: startTime } },
      ],
    },
  });

  const profOverlapping = await Activity.findOne({
    where: {
      dayOfWeek,
      idProf,
      idSemester,
      [Op.and]: [
        { startTime: { [Op.lt]: endTime } },
        { endTime: { [Op.gt]: startTime } },
      ],
    },
  });

  if (roomOverlapping) {
    return {
      code: 409,
      message: "The room is occupied during this time.",
    };
  }
  if (profOverlapping) {
    return {
      code: 409,
      message: "The teacher already has an activity in this interval.",
    };
  }
  return null;
}
