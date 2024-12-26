import style from "../styles/Navbar.module.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const logout = async () => {
    await axios.delete("http://localhost:5000/logout");
    navigate("/");
  };

  return (
    <header>
      <nav className={style.navbar}>
        <button onClick={logout}>Log out</button>
      </nav>
    </header>
  );
};

export default Navbar;
