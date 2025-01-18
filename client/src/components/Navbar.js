import style from "../styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../context/UserContext";

const Navbar = () => {
  const { setAuth } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setAuth({});
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <header>
      <nav className={style.navbar}>
        <button onClick={handleLogout}>Log out</button>
      </nav>
    </header>
  );
};

export default Navbar;
