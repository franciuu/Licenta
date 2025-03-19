import style from "../styles/Navbar.module.css";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <header>
      <nav className={style.navbar}>
        <button
          onClick={() => navigate("/admin/generate")}
          className={style.btn}
        >
          Update
        </button>
        <button onClick={handleLogout} className={style.btn}>
          Log out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
