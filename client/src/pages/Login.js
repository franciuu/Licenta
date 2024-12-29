import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext.js";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";
import style from "../styles/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);

    if (!error) {
        navigate("/dashboard");
    }
};

  return (
    <div className={style.loginPage}>
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.textDiv}>
            <h1 className={style.title}>Attendance system abcdefg</h1>
            <p className={style.subtitle}>gdhsgdkh</p>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.headerDiv}>
            <img src={logo} alt="logo" className={style.logo} />
            <h2 className={style.welcomeText}>Welcome back!</h2>
          </div>
          {error && <p className={style.errorMessage}>{error}</p>}
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputDiv}>
              <label htmlFor="email" className={style.label}>
                Email:
              </label>
              <div className={style.input}>
                <FaUserShield className={style.icon} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className={style.inputField}
                />
              </div>
            </div>

            <div className={style.inputDiv}>
              <label htmlFor="password" className={style.label}>
                Password:
              </label>
              <div className={style.input}>
                <BsFillShieldLockFill className={style.icon} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={style.inputField}
                />
              </div>
            </div>

            <button type="submit" className={style.btn}>
              <span className={style.loginText}>Login</span>
              <FaLongArrowAltRight className={style.btnIcon} />
            </button>

            <span className={style.forgotPassword}>
              Forgot your password?{" "}
              <a href="#" className={style.forgotPasswordLink}>
                Click Here
              </a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
