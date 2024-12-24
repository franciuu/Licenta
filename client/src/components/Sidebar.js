import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li className="sidebar-section">
          <NavLink to={"/dashboard"}>Dashboard</NavLink>
        </li>
        <li className="sidebar-section">
          <NavLink to={"/users"}>Users</NavLink>
        </li>
      </ul>
    </aside>
  );
};
export default Sidebar;
