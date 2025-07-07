import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/PasswordResetService";
import style from "../styles/Login.module.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setMessage("Password reset successfully. You can now log in.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div className={style.loginPage}><div className={style.container}><div className={style.right}><div className={style.errorMessage}>Invalid or missing token.</div></div></div></div>;
  }

  return (
    <div className={style.loginPage}>
      <div className={style.container}>
        <div className={style.right} style={{ width: "100%" }}>
          <h2 className={style.welcomeText}>Set a new password</h2>
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputDiv}>
              <label htmlFor="password" className={style.label}>New Password:</label>
              <input
                type="password"
                id="password"
                className={style.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={style.inputDiv}>
              <label htmlFor="confirmPassword" className={style.label}>Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                className={style.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={style.btn} disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
            {message && <div className={style.errorMessage} style={{ color: "green" }}>{message}</div>}
            {error && <div className={style.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 