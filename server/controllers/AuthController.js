import User from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Wrong Password" });
  const role = user.role;
  const accessToken = jwt.sign(
    {
      UserInfo: {
        userId: user.uuid,
        role: role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30s",
    }
  );
  const refreshToken = jwt.sign(
    { userId: user.uuid },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  await User.update(
    { refreshToken: refreshToken },
    { where: { email: req.body.email } }
  );
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ role, accessToken });
};

export const logout = async (req, res) => {
  console.log("Cookies received:", req.cookies); // Vezi ce primește backend-ul

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("No JWT found in cookies");
    return res.sendStatus(204);
  }

  const rToken = cookies.jwt;
  const user = await User.findOne({ where: { refreshToken: rToken } });

  if (!user) {
    console.log("User not found with this refreshToken");
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  await User.update({ refreshToken: null }, { where: { uuid: user.uuid } });
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};
