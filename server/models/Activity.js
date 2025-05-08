import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Activity = db.define(
  "activities",
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
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        min: 0,
        max: 6,
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: true,
        isLaterThanStartTime(value) {
          if (this.startTime && value <= this.startTime) {
            throw new Error("End time trebuie să fie după start time!");
          }
        },
      },
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: DataTypes.ENUM("lecture", "seminar"),
      allowNull: false,
      defaultValue: "seminar",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default Activity;
