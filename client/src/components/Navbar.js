import style from "../styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
      <nav className={style.navbar}>
        <button>Log out</button>
      </nav>
    </header>
  );
};

export default Navbar;
