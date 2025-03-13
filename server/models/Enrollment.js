import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Enrollment = db.define(
  "enrollments",
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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default Enrollment;
