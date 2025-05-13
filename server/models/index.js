import db from "../config/database.js";

import Student from "./Student.js";
import User from "./User.js";
import Course from "./Course.js";
import Activity from "./Activity.js";
import Attendance from "./Attendance.js";
import Image from "./Image.js";
import Enrollment from "./Enrollment.js";
import Semester from "./Semester.js";
import Period from "./Period.js";
import AcademicYear from "./AcademicYear.js";
import Room from "./Room.js";

Student.hasMany(Attendance, {
  foreignKey: "idStudent",
  onDelete: "CASCADE",
  targetKey: "uuid",
});
Attendance.belongsTo(Student, { foreignKey: "idStudent", targetKey: "uuid" });

Activity.hasMany(Attendance, { foreignKey: "idActivity", onDelete: "CASCADE" });
Attendance.belongsTo(Activity, { foreignKey: "idActivity" });

Student.hasMany(Enrollment, { foreignKey: "idStudent", onDelete: "CASCADE" });
Enrollment.belongsTo(Student, { foreignKey: "idStudent" });

Activity.hasMany(Enrollment, { foreignKey: "idActivity", onDelete: "CASCADE" });
Enrollment.belongsTo(Activity, { foreignKey: "idActivity" });

Course.hasMany(Activity, { foreignKey: "idCourse", onDelete: "CASCADE" });
Activity.belongsTo(Course, { foreignKey: "idCourse" });

Room.hasMany(Activity, { foreignKey: "idRoom", onDelete: "CASCADE" });
Activity.belongsTo(Room, { foreignKey: "idRoom" });

User.hasMany(Activity, { foreignKey: "idProf", onDelete: "CASCADE" });
Activity.belongsTo(User, { foreignKey: "idProf" });

Student.hasMany(Image, { foreignKey: "idStudent", onDelete: "CASCADE" });
Image.belongsTo(Student, { foreignKey: "idStudent" });

AcademicYear.hasMany(Semester, {
  foreignKey: "idAcademicYear",
  onDelete: "CASCADE",
});
Semester.belongsTo(AcademicYear, { foreignKey: "idAcademicYear" });

Semester.hasMany(Activity, {
  foreignKey: "idSemester",
  onDelete: "CASCADE",
});
Activity.belongsTo(Semester, { foreignKey: "idSemester" });

AcademicYear.hasMany(Period, {
  foreignKey: "idAcademicYear",
  onDelete: "CASCADE",
});
Period.belongsTo(AcademicYear, { foreignKey: "idAcademicYear" });

Semester.hasMany(Period, {
  foreignKey: "idSemester",
  onDelete: "CASCADE",
});
Period.belongsTo(Semester, { foreignKey: "idSemester" });

export { db, Student, User, Course, Activity, Attendance, Period };
