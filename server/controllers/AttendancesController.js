import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Activity from "../models/Activity.js";
import Semester from "../models/Semester.js";
import Enrollment from "../models/Enrollment.js";
import { getActivityDates } from "../utils/dateUtils.js";

export const getActivityAttendances = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ msg: "Missing date parameter" });
  }

  try {
    const response = await Attendance.findAll({
      where: {
        idActivity: req.params.id,
        date: date,
      },
      include: {
        model: Student,
        attributes: ["name"],
      },
    });

    if (response) {
      const formatted = response.map((e) => ({
        name: e.student?.name,
        date: e.date,
        arrivalTime: e.arrivalTime,
      }));

      return res.status(200).json(formatted);
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAttendanceTrendForActivity = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      where: { uuid: req.params.id },
      include: [
        {
          model: Semester,
          attributes: ["startDate", "endDate"],
        },
      ],
    });
    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    const raw = activity.toJSON();
    const allDates = getActivityDates(
      raw.semester?.startDate,
      raw.semester?.endDate,
      raw.dayOfWeek
    );

    const today = new Date();
    const pastDates = allDates.filter((date) => new Date(date) <= today);
    const last4Dates = pastDates.slice(-4);

    const counts = await Promise.all(
      last4Dates.map(async (date) => {
        const presentCount = await Attendance.count({
          where: {
            idActivity: activity.uuid,
            date: date,
          },
        });
        return { date, presentCount };
      })
    );

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAttendancePercentageForCourse = async (req, res) => {
  try {
    const activity = await Activity.findOne({
      where: { uuid: req.params.id },
      include: [
        {
          model: Semester,
          attributes: ["startDate", "endDate"],
        },
      ],
    });

    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    const raw = activity.toJSON();
    const today = new Date();

    const allPastDates = getActivityDates(
      raw.semester?.startDate,
      raw.semester?.endDate,
      raw.dayOfWeek
    ).filter((date) => new Date(date) <= today);

    const enrolledStudents = await Enrollment.count({
      where: {
        idActivity: activity.uuid,
      },
    });

    const expectedTotal = enrolledStudents * allPastDates.length;

    const actualPresences = await Attendance.count({
      where: {
        idActivity: activity.uuid,
        date: allPastDates,
      },
    });

    const presencePercentage = (actualPresences / expectedTotal) * 100;
    const absencePercentage = 100 - presencePercentage;

    return res.status(200).json([
      { name: "Present", value: presencePercentage },
      { name: "Absent", value: absencePercentage },
    ]);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
