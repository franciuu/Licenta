import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import style from "../styles/Layout.module.css";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  return (
    <div className={style.layoutContainer}>
      <Navbar />
      <div className={style.layoutColumns}>
        <div className={style.layoutSidebar}>
          <Sidebar />
        </div>
        <div className={style.layoutContent}>
          <main>
            {children}
            <ToastContainer autoClose={2000} style={{ top: "80px" }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
