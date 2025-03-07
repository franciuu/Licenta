import db from "../config/database.js";

import Student from "./Student.js";
import User from "./User.js";
import Course from "./Course.js";
import Activity from "./Activity.js";
import Attendance from "./Attendance.js";
import SurveillanceCamera from "./SurveillanceCamera.js";
import Image from "./Image.js";

Student.hasMany(Attendance, { foreignKey: "idStudent" });
Attendance.belongsTo(Student, { foreignKey: "idStudent" });

Activity.hasMany(Attendance, { foreignKey: "idActivity" });
Attendance.belongsTo(Activity, { foreignKey: "idActivity" });

Course.hasMany(Activity, { foreignKey: "idCourse", onDelete: "CASCADE" });
Activity.belongsTo(Course, { foreignKey: "idCourse" });

User.hasMany(Activity, { foreignKey: "idProf" });
Activity.belongsTo(User, { foreignKey: "idProf" });

SurveillanceCamera.hasMany(Activity, { foreignKey: "idCamera" });
Activity.belongsTo(SurveillanceCamera, { foreignKey: "idCamera" });

Student.hasMany(Image, { foreignKey: "idStudent", onDelete: "CASCADE" });
Image.belongsTo(Student, { foreignKey: "idStudent" });

export { db, Student, User, Course, Activity, Attendance, SurveillanceCamera };
