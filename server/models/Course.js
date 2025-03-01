import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Course = db.define(
  "courses",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    programLevel: {
      type: DataTypes.ENUM("Bachelor", "Master"),
      defaultValue: "Bachelor",
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
export default Course;
