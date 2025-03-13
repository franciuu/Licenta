import Attendance from "../models/Attendance.js";

export const getActivityAttendances = async (req, res) => {
  try {
    const response = await Attendance.findAll({
      where: {
        idActivity: req.params.idActivity,
      },
    });
    if (!response) {
      res.status(404).json({ msg: "Not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
