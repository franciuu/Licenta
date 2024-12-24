import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";
import "../styles/Login.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// const schema = Yup.object().shape({
//     email: Yup.string().email().required(),
//     password: Yup.string().required(),
// });
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
  
      if (response.data) {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  
  return (
    <div className="loginPage">
      <div className="container">
        <div className="left">
          <div className="textDiv">
            <h1 className="title">Attendance system abcdefg</h1>
            <p>gdhsgdkh</p>
          </div>

          <div className="footerDiv">
            <span>Don't have an account?</span>
            <Link to={"/register"}>
              <button className="btn">Sign Up</button>
            </Link>
          </div>
        </div>
        <div className="right">
          <div className="headerDiv">
            <img src={logo} alt="logo" />
            <h2>Welcome back!</h2>
          </div>
          {error && <p>{error}</p>}
          <form onSubmit={login}>
            <div className="inputDiv">
              <label htmlFor="email">Email: </label>
              <div className="input">
                <FaUserShield className="icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Password: </label>
              <div className="input">
                <BsFillShieldLockFill className="icon" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            </div>

            <button type="submit" className="btn">
              <span className="loginText">Login</span>
              <FaLongArrowAltRight className="icon" />
            </button>

            <span className="forgotPassword">
              Forgot your password? <a href="#">Click Here</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
