import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Image = db.define(
  "images",
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
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
export default Image;
