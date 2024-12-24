import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-columns">
        <div className="layout-sidebar">
          <Sidebar />
        </div>
        <div className="layout-content">
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
