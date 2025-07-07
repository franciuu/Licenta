import { useState } from "react";
import { requestPasswordReset } from "../services/PasswordResetService";
import style from "../styles/Login.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setMessage("A reset link has been sent to your email. Please check your inbox.");
    } catch (err) {
      setError("This email does not exist in our database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.loginPage}>
      <div className={style.container}>
        <div className={style.right} style={{ width: "100%" }}>
          <h2 className={style.welcomeText}>Forgot your password?</h2>
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputDiv}>
              <label htmlFor="email" className={style.label}>Email:</label>
              <div className={style.input}>
                <input
                  type="email"
                  id="email"
                  className={style.inputField}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className={style.btn} disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
            {message && <div className={style.errorMessage} style={{ color: "green" }}>{message}</div>}
            {error && <div className={style.errorMessage}>{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 