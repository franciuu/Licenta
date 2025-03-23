import { useNavigate } from "react-router-dom";
import styles from "../styles/Unauthorized.module.css";
import { FaLock } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Unauthorized = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (auth.role === "admin") {
      navigate("/admin/academic");
    } else if (auth.role === "professor") {
      navigate("/professor/dashboard");
    }
  };

  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.iconWrapper}>
        <FaLock className={styles.icon} />
      </div>
      <h1 className={styles.title}>Unauthorized Access</h1>
      <p className={styles.message}>
        You do not have permission to view this page.
      </p>
      <button className={styles.backButton} onClick={handleOnClick}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
