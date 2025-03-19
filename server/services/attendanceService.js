import Attendance from "../models/Attendance.js";

const markAttendance = async (studentId, activityId) => {
  const today = new Date()
    .toLocaleDateString("ro-RO")
    .split(".")
    .reverse()
    .join("-");
  const arrivalTime = new Date().toLocaleTimeString("ro-RO", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const [attendance, created] = await Attendance.findOrCreate({
    where: {
      idStudent: studentId,
      idActivity: activityId,
      date: today,
    },
    defaults: {
      idStudent: studentId,
      idActivity: activityId,
      date: today,
      arrivalTime: arrivalTime,
    },
  });

  return { attendance, created };
};
export default markAttendance;
