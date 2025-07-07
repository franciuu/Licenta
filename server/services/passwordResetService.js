import crypto from "crypto";
import argon2 from "argon2";
import Users from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/sendMail.js";

const resetTokens = {};

export const generateResetToken = async (email, baseUrl) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) throw new Error("This email does not exist in our database.");
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 60; 
  resetTokens[token] = { email, expires };
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, user.name, resetUrl);
};

export const resetPassword = async (token, newPassword) => {
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) {
    delete resetTokens[token];
    throw new Error("Token invalid sau expirat");
  }
  const user = await Users.findOne({ where: { email: data.email } });
  if (!user) throw new Error("User not found");
  const hashed = await argon2.hash(newPassword);
  await user.update({ password: hashed });
  delete resetTokens[token];
}; 