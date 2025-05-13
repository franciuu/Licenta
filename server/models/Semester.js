import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Semester = db.define(
  "semesters",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStart(value) {
          if (value <= this.startDate) {
            throw new Error(
              "Data de sfârșit trebuie să fie după data de început."
            );
          }
        },
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
  }
);
export default Semester;
