import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";

import logo from "../assets/logo.png";
import style from "../styles/Login.module.css";

import { FaUserShield, FaLongArrowAltRight } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      const accessToken = response?.data?.accessToken;
      const role = response.data.role;
      setAuth({ email, password, role, accessToken });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        console.log(error);
        setError("Server is not responding. Please try again later.");
      } else if (error.response?.status === 400) {
        setError("Missing username or password");
      } else if (error.response?.status === 404) {
        setError("Unauthorized");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
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
                  autoComplete="off"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
