import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaTrashCan, FaCalendar } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getAcademicYears } from "../../services/AcademicYearService";
import styles from "../../styles/AcademicYears.module.css";

const AcademicYears = () => {
  const [years, setYears] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchYearsData = async () => {
      try {
        const yearsData = await getAcademicYears(axiosCustom);
        setYears(yearsData);
        console.log(yearsData);
      } catch (error) {
        console.error("Failed to fetch academic years data", error);
      }
    };

    fetchYearsData();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.headerSection}>
          <div>
            <h1 className={styles.pageTitle}>Academic Years</h1>
          </div>
          <Link to="/admin/academic/add" className={styles.btn}>
            <span>+</span>
            An Universitar Nou
          </Link>
        </div>

        {years?.length ? (
          <div className={styles.cardsContainer}>
            {years.map((y) => (
              <div key={y.uuid} className={styles.yearCard}>
                <div className={styles.yearTitle}>
                  <FaGraduationCap className={styles.graduationIcon} />
                  <span>{y.name}</span>
                </div>

                <div className={styles.dateInfo}>
                  <div className={styles.dateRow}>
                    <FaCalendar className={styles.calendarIcon} />
                    <span>Start: {y.startDate}</span>
                  </div>
                  <div className={styles.dateRow}>
                    <FaCalendar className={styles.calendarIcon} />
                    <span>End: {y.endDate}</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button className={styles.detailsButton}>Details</button>
                  <button className={styles.editButton}>
                    <MdOutlineEdit className={styles.editIcon} />
                  </button>
                  <button className={styles.deleteButton}>
                    <FaTrashCan className={styles.deleteIcon} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noYears}>
            <p className={styles.noYearsText}>
              No academic years have been registered yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AcademicYears;
