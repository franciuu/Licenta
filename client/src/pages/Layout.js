import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import style from "../styles/Layout.module.css";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
    <div className={style.layoutContainer}>
      <Navbar />
      <Sidebar />
      <div className={style.layoutContent}>
        <main className={style.mainContent}>
          {children}
          <ToastContainer autoClose={3000} position="top-right" />
        </main>
      </div>
    </div>
  );
};

export default Layout;
