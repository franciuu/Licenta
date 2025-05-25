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
          if (value <= this.startTime) {
            throw new Error(
              "Ora de sfârșit trebuie să fie după ora de început!"
            );
          }
        },
      },
    },
    type: {
      type: DataTypes.ENUM("lecture", "seminar"),
      allowNull: false,
      defaultValue: "seminar",
    },
    idCourse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: "courses",
        key: "uuid",
      },
    },
    idProf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: "users",
        key: "uuid",
      },
    },
    idSemester: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: "semesters",
        key: "uuid",
      },
    },
    idRoom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      references: {
        model: "rooms",
        key: "uuid",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default Activity;
