import Attendance from "../models/Attendance.js";

const markAttendance = async (studentId, activityId) => {
  const today = new Date().toISOString().split("T")[0];
  const arrivalTime = new Date().toISOString().split("T")[1].split(".")[0]; // Ora curentă fără milisecunde

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
      arrivalTime: arrivalTime, // Adăugat câmpul arrivalTime
    },
  });

  return attendance;
};
export default markAttendance;
