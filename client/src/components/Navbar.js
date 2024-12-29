import style from "../styles/Navbar.module.css";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, error } = useUser();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    await logout();

    if (!error) {
      navigate("/");
    }
  };
  return (
    <header>
      <nav className={style.navbar}>
        <button onClick={handleClick}>Log out</button>
      </nav>
    </header>
  );
};

export default Navbar;
