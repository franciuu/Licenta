import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import useAuth from "../hooks/useAuth";
import logo from "../assets/logo.png";
import style from "../styles/Login.module.css";

import { FaUserShield, FaLongArrowAltRight } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [error, setError] = useState(null);
  const redirectByRole = {
    admin: "/admin/academic",
    professor: "/professor/dashboard",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      const name = response?.data?.name;
      setAuth({ email: data.email, name, role, accessToken });
      navigate(redirectByRole[role] || from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        console.log(error.response);
        setError("Server is not responding. Please try again later.");
      } else if (
        error.response.status === 401 ||
        error.response.status === 404
      ) {
        setError("Invalid username or password.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const handleCheck = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className={style.loginPage}>
      <div className={style.container}>
        <div className={style.left}>
          <div className={style.textDiv}>
            <h1 className={style.title}>Vision Roster</h1>
            <p className={style.subtitle}>
              Simplifying Academic Management, One Click at a Time.
            </p>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.headerDiv}>
            <img
              src={logo || "/placeholder.svg"}
              alt="Vision Roster Logo"
              className={style.logo}
            />
            <h2 className={style.welcomeText}>Welcome back!</h2>
          </div>

          {error && <div className={style.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
            <div className={style.inputDiv}>
              <label htmlFor="email" className={style.label}>
                Email:
              </label>
              <div className={style.input}>
                <FaUserShield className={style.icon} />
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  className={style.inputField}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className={style.error} role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={style.inputDiv}>
              <label htmlFor="password" className={style.label}>
                Password:
              </label>
              <div className={style.input}>
                <BsFillShieldLockFill className={style.icon} />
                <input
                  {...register("password")}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className={style.inputField}
                  autoComplete="off"
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>
              {errors.password && (
                <p className={style.error} role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={style.btn}
              aria-busy={isSubmitting}
            >
              <span className={style.loginText}>
                {isSubmitting ? "Logging in..." : "Login"}
              </span>
              {!isSubmitting && (
                <FaLongArrowAltRight className={style.btnIcon} />
              )}
            </button>

            <div className={style.checkboxContainer}>
              <input
                type="checkbox"
                id="persist"
                onChange={handleCheck}
                checked={persist}
              />
              <label htmlFor="persist">Trust this device</label>
            </div>

            <div className={style.forgotPassword}>
              Forgot your password?
              <a href="#reset-password" className={style.forgotPasswordLink}>
                Click Here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
