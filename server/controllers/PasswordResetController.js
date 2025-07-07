import { generateResetToken, resetPassword } from "../services/passwordResetService.js";

export const requestReset = async (req, res) => {
  const { email } = req.body;
  const baseUrl = req.headers.origin || "http://localhost:3000";
  try {
    await generateResetToken(email, baseUrl);
    res.status(200).json({ message: "A reset link has been sent to your email. Please check your inbox." });
  } catch (err) {
    res.status(400).json({ message: err.message || "Something went wrong." });
  }
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  try {
    await resetPassword(token, password);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(400).json({ message: err.message || "Invalid or expired token." });
  }
}; 