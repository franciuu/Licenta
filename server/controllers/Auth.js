import User from "../models/User.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({ msg: "User not found" });
  }
  const match = await argon2.verify(user.password, req.body.password);
};
