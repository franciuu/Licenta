import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

export const getActivityAttendances = async (req, res) => {
  try {
    const response = await Attendance.findAll({
      where: {
        idActivity: req.params.id,
      },
      include: {
        model: Student,
        attributes: ["name"],
      },
    });

    if (response) {
      const formatted = response.map((e) => ({
        name: e.student?.name || "Unknown",
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
