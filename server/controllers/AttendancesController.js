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

    console.log(req.params.id);

    if (!response || response.length === 0) {
      return res.status(404).json({ msg: "No attendances found" });
    }

    const formatted = response.map((entry) => ({
      name: entry.Student?.name || "Unknown",
      date: entry.date,
      arrivalTime: entry.arrivalTime,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
