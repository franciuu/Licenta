import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Period = db.define(
  "academic_periods",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM("vacation", "exams"),
      allowNull: false,
      defaultValue: "vacation",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAfterStart(value) {
          if (this.startDate && value <= this.startDate) {
            throw new Error("endDate trebuie să fie după startDate");
          }
        },
      },
    },
    idSemester: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: "semesters",
        key: "uuid",
      },
    },
    idAcademicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "academic_years",
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    validate: {
      atLeastOneReference() {
        if (!this.idAcademicYear && !this.idSemester) {
          throw new Error(
            "Trebuie să existe cel puțin un idAcademicYear sau idSemester."
          );
        }
      },
    },
  }
);
export default Period;
