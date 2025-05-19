import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaUserFriends,
  FaGraduationCap,
  FaBook,
  FaUsers,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaUniversity,
} from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { Avatar } from "@chakra-ui/react";
import style from "../styles/Sidebar.module.css";
import useAuth from "../hooks/useAuth";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { getPersonalActivities } from "../services/ActivityService";

const Sidebar = () => {
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();
  const { auth } = useAuth();

  useEffect(() => {
    const getActivities = async () => {
      try {
        const activitiesData = await getPersonalActivities(axiosCustom);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch activities data:", error);
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
        {auth.role === "admin" && (
          <ul className={style.sidebarMenu}>
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
                to="/admin/students"
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
                to="/settings"
                className={({ isActive }) =>
                  `${style.itemText} ${isActive ? style.active : ""}`
                }
              >
                <IoSettingsSharp className={style.icon} />
                <span className={style.label}>Settings</span>
              </NavLink>
            </li>
          </ul>
        )}
        {auth.role === "professor" && (
          <ul className={style.sidebarMenu}>
            <li className={style.sidebarItem}>
              <NavLink
                to="/professor/dashboard"
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
                to="/professor/students"
                className={({ isActive }) =>
                  `${style.itemText} ${isActive ? style.active : ""}`
                }
              >
                <FaUsers className={style.icon} />
                <span className={style.label}>Students</span>
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
        )}
      </div>

      {auth.role === "professor" && (
        <div className={style.activitiesContainer}>
          <p className={style.menuTitle}>MY ACTIVITIES</p>
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
      )}

      <div className={style.sidebarFooter}>
        <Avatar.Root colorPalette="orange" className={style.avatar}>
          <Avatar.Fallback name={auth.name || "User Name"} />
        </Avatar.Root>
        <div className={style.userInfo}>
          <h4 className={style.userName}>{auth.name || "User Name"}</h4>
          <span className={style.userEmail}>{auth.email}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
