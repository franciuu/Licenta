import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import style from "../styles/Layout.module.css";

const Layout = ({ children }) => {
  return (
    <div className={style.layoutContainer}>
      <Navbar />
      <div className={style.layoutColumns}>
        <div className="layout-sidebar">
          <Sidebar />
        </div>
        <div className={style.layoutContent}>
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
