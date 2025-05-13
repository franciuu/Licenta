import { DataTypes } from "sequelize";
import db from "../config/database.js";

const AcademicYear = db.define(
  "academic_years",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default AcademicYear;
