import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../Layout";
import MyCarousel from "../../components/professor/Carousel";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useParams, Link } from "react-router-dom";
import { getStudentById } from "../../services/StudentService";
import Loader from "../../components/Loader";
import dateFormat from "dateformat";
import styles from "../../styles/ViewStudent.module.css";

const ViewStudent = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [student, setStudent] = useState(null);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const studentData = await getStudentById(axiosCustom, id);
        setStudent(studentData);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/404");
        }
        console.error("Failed to fetch student data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchStudent();
  }, [navigate, axiosCustom, id]);

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.studentContainer}>
        {student ? (
          <>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>{student.name}'s Profile</h1>
              <Link to="/admin/students" className={styles.backButton}>
                Back to Students
              </Link>
            </div>

            <div className={styles.contentWrapper}>
              <div className={styles.studentInfoSection}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name:</span>
                  <span className={styles.infoValue}>{student.name}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Birth Date:</span>
                  <span className={styles.infoValue}>
                    {dateFormat(student.birthDate, "dd-mmm-yyyy")}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email Address:</span>
                  <span className={styles.infoValue}>{student.email}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Study Year:</span>
                  <span className={styles.studyYearValue}>
                    Year {student.studyYear}
                  </span>
                </div>
              </div>

              <div className={styles.carouselSection}>
                {student.images?.length > 0 ? (
                  <div className={styles.carouselWrapper}>
                    <MyCarousel
                      urls={student.images.map((img) => img.imageUrl)}
                    />
                  </div>
                ) : (
                  <div className={styles.emptyStateWrapper}>
                    <div className={styles.emptyState}>No images available</div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.noData}>Student not found</div>
        )}
      </div>
    </Layout>
  );
};

export default ViewStudent;
