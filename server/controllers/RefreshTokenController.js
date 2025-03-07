import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const rToken = cookies.jwt;
  const user = await User.findOne({
    where: {
      refreshToken: rToken,
    },
  });
  if (!user) {
    return res.sendStatus(403);
  }
  jwt.verify(rToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.uuid !== decoded.userId) {
      return res.sendStatus(403);
    }
    const role = user.role;
    const name = user.name;
    const email = user.email;
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: decoded.userId,
          role: role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ role, accessToken, name, email });
  });
};
