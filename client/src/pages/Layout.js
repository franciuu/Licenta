import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import style from "../styles/Layout.module.css";
import { ToastContainer } from "react-toastify";

const Layout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    // Get sidebar state from local storage if available
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState !== null) {
      setSidebarExpanded(JSON.parse(savedState));
    }

    // Listen for sidebar toggle events
    const handleSidebarToggle = (e) => {
      if (e.detail && e.detail.expanded !== undefined) {
        setSidebarExpanded(e.detail.expanded);
        localStorage.setItem(
          "sidebarExpanded",
          JSON.stringify(e.detail.expanded)
        );
      }
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);

    // Add or remove class to body based on sidebar state
    if (!sidebarExpanded) {
      document.body.classList.add("sidebar-collapsed");
    } else {
      document.body.classList.remove("sidebar-collapsed");
    }

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, [sidebarExpanded]);

  return (
    <div className={style.layoutContainer}>
      <Navbar />
      <Sidebar />
      <div
        className={`${style.layoutContent} ${
          !sidebarExpanded ? style.contentExpanded : ""
        }`}
      >
        <main className={style.mainContent}>
          {children}
          <ToastContainer autoClose={3000} position="top-right" />
        </main>
      </div>
    </div>
  );
};

export default Layout;
