import styles from "../styles/Unauthorized.module.css";
import { FaLock } from "react-icons/fa";

const Unauthorized = () => {
  return (
    <div className={styles.unauthorizedContainer}>
      <div className={styles.iconWrapper}>
        <FaLock className={styles.icon} />
      </div>
      <h1 className={styles.title}>Unauthorized Access</h1>
      <p className={styles.message}>
        You do not have permission to view this page.
      </p>
    </div>
  );
};

export default Unauthorized;
