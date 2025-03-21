import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaUserFriends,
  FaGraduationCap,
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUniversity,
} from "react-icons/fa";
import style from "../styles/Sidebar.module.css";
import useAuth from "../hooks/useAuth";
import useAxiosCustom from "../hooks/useAxiosCustom";

const Sidebar = () => {
  const { auth } = useAuth();
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
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

    if (auth.role === "professor") {
      getActivities();
    }
  }, [axiosCustom, auth.role]);

  return (
    <aside className={style.sidebar}>
      <div className={style.sidebarHeader}>
        <h2 className={style.logo}>Vision Roster</h2>
      </div>

      <div className={style.menuContainer}>
        <p className={style.menuTitle}>MAIN MENU</p>
        <ul className={style.sidebarMenu}>
          <li className={style.sidebarItem}>
            <NavLink
              to="/admin/academic"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaUniversity className={style.icon} />
              <span className={style.label}>Academic</span>
            </NavLink>
          </li>
          <li className={style.sidebarItem}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${style.itemText} ${isActive ? style.active : ""}`
              }
            >
              <FaHome className={style.icon} />
              <span className={style.label}>Dashboard</span>
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
              <span className={style.label}>Users</span>
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
              <span className={style.label}>Students</span>
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
              <span className={style.label}>Courses</span>
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
              <span className={style.label}>Add Activity</span>
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
              <span className={style.label}>My Schedule</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={style.activitiesContainer}>
        {auth.role === "professor" && (
          <p className={style.menuTitle}>MY ACTIVITIES</p>
        )}
        <div className={style.activitiesSection}>
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
                  <span className={style.label}>{a.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={style.sidebarFooter}>
        <img
          src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
          alt="Avatar"
          className={style.avatar}
        />
        <div className={style.userInfo}>
          <h4 className={style.userName}>{auth.name || "User Name"}</h4>
          <span className={style.userEmail}>{auth.email}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
