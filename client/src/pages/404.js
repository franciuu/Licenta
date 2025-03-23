import { useNavigate } from "react-router-dom";
import styles from "../styles/404.module.css";
import useAuth from "../hooks/useAuth";

const Page404 = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleOnClick = () => {
    if (auth.role === "admin") {
      navigate("/admin/academic");
    } else if (auth.role === "professor") {
      navigate("/professor/dashboard");
    }
  };

  return (
    <div className={styles.page404Container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.message}>Oops! Page not found.</p>
      <button className={styles.backButton} onClick={handleOnClick}>
        Go Back
      </button>
    </div>
  );
};

export default Page404;
