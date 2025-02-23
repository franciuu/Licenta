import { DataTypes } from "sequelize";
import db from "../config/database.js";

const SurveillanceCamera = db.define(
  "cameras",
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
export default SurveillanceCamera;
