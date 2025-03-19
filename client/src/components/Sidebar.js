import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsChevronBarRight, BsChevronBarLeft } from "react-icons/bs";
import {
  FaHome,
  FaUserFriends,
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
} from "react-icons/fa";
import style from "../styles/Sidebar.module.css";
import useAuth from "../hooks/useAuth";
import useAxiosCustom from "../hooks/useAxiosCustom";

const Sidebar = () => {
  const { auth } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();

  const toggleSidebar = () => {
    setExpanded((curr) => !curr);
  };

  const getActivities = async () => {
    try {
      const response = await axiosCustom.get(`/activities/personal`);
      setActivities(response.data);
    } catch (error) {
      console.error(
        "Error fetching activities:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <aside className={`${style.sidebar} ${expanded ? style.expanded : ""}`}>
      <div className={style.sidebarHeader}>
        {expanded && <h2 className={style.logo}>Vision Roster</h2>}
        <button className={style.toggleButton} onClick={toggleSidebar}>
          {expanded ? <BsChevronBarLeft /> : <BsChevronBarRight />}
        </button>
      </div>

      <div className={style.menuContainer}>
        {expanded && <p className={style.menuTitle}>MAIN MENU</p>}
        <ul className={style.sidebarMenu}>
          <li className={style.sidebarItem}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaHome className={style.icon} />
              {expanded && <span className={style.label}>Dashboard</span>}
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaUserFriends className={style.icon} />
              {expanded && <span className={style.label}>Users</span>}
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaGraduationCap className={style.icon} />
              {expanded && <span className={style.label}>Students</span>}
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaBook className={style.icon} />
              {expanded && <span className={style.label}>Courses</span>}
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/admin/activities/add"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaChalkboardTeacher className={style.icon} />
              {expanded && <span className={style.label}>Add Activity</span>}
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/professor/calendar"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaCalendarAlt className={style.icon} />
              {expanded && <span className={style.label}>My Schedule</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={style.activitiesSection}>
        {auth.role === "professor" && expanded && (
          <p className={style.menuTitle}>MY ACTIVITIES</p>
        )}
        <ul className={style.sidebarMenu}>
          {activities.map((a) => (
            <li key={a.uuid} className={style.sidebarItem}>
              <NavLink
                to={`/professor/activities/${a.uuid}`}
                className={({ isActive }) =>
                  `${style.itemText} ${isActive ? style.active : ""}`
                }
              >
                <span className={style.activityIcon}>•</span>
                {expanded && <span className={style.label}>{a.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={style.sidebarFooter}>
        <img
          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
          alt="Avatar"
          className={style.avatar}
        />
        {expanded && (
          <div className={style.userInfo}>
            <h4 className={style.userName}>{auth.name || "User Name"}</h4>
            <span className={style.userEmail}>{auth.email}</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
