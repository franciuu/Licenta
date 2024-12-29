import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";
import { BsChevronBarRight, BsChevronBarLeft } from "react-icons/bs";
import { FaHome, FaUserFriends, FaGraduationCap } from "react-icons/fa";
import style from "../styles/Sidebar.module.css";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded((curr) => !curr);
  };

  return (
    <aside className={style.sidebar}>
      <div className={style.sidebarHeader}>
        {expanded && <h2 className={style.logo}>Logo</h2>}
        <button className={style.toggleButton} onClick={toggleSidebar}>
          {expanded ? <BsChevronBarRight /> : <BsChevronBarLeft />}
        </button>
      </div>
      <ul className={style.sidebarMenu}>
        <li className={style.sidebarItem}>
          <NavLink to="/dashboard" className={style.itemText}>
            <FaHome className={style.icon} />
            {expanded && <span className={style.label}>Dashboard</span>}
          </NavLink>
        </li>
        <li className={style.sidebarItem}>
          <NavLink to="/users" className={style.itemText}>
            <FaUserFriends className={style.icon} />
            {expanded && <span className={style.label}>Users</span>}
          </NavLink>
        </li>
        <li className={style.sidebarItem}>
          <NavLink to="/students" className={style.itemText}>
            <FaGraduationCap className={style.icon} />
            {expanded && <span className={style.label}>Students</span>}
          </NavLink>
        </li>
      </ul>
      <div className={style.sidebarFooter}>
        <img
          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
          alt="Avatar"
          className={style.avatar}
        />
        {expanded && (
          <div className={style.userInfo}>
            <h4 className={style.userName}>John</h4>
            <span className={style.userEmail}>john@test.com</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
