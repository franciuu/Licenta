import { NavLink } from "react-router-dom";
import style from "../styles/Sidebar.module.css";
const Sidebar = () => {
  return (
    <aside className={style.sidebar}>
      <ul>
        <li className={style.sidebarSection}>
          <NavLink to={"/dashboard"}>Dashboard</NavLink>
        </li>
        <li className={style.sidebarSection}>
          <NavLink to={"/users"}>Users</NavLink>
        </li>
      </ul>
    </aside>
  );
};
export default Sidebar;
