import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../Layout";
import { getActivityById } from "../../services/ActivityService";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getStudentByEmail } from "../../services/StudentService";
import {
  createEnrollment,
  getActivityEnrollments,
} from "../../services/EnrollmentService";
import { toast } from "react-toastify";
import styles from "../../styles/ActivityEnrollment.module.css";

const ActivityEnrollment = () => {
  const [activity, setActivity] = useState({});
  const [email, setEmail] = useState("");
  const [notFound, setNotFound] = useState("");
  const [exist, setExist] = useState("");
  const [student, setStudent] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const [enrollments, setEnrollments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const fetchEnrollmentsData = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const enrollmentsData = await getActivityEnrollments(axiosCustom, id);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error("Failed to fetch student data", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchActivityData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const activityData = await getActivityById(axiosCustom, id);
        setActivity(activityData);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/404");
        }
        console.error("Failed to fetch activity data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchActivityData();
    fetchEnrollmentsData();
  }, []);

  const onAddEnrollment = async () => {
    try {
      const enrollmentData = await createEnrollment(
        axiosCustom,
        student.uuid,
        id
      );
      if (enrollmentData) {
        fetchEnrollmentsData();
        toast.success("Student enrolled successfully!", {
          position: "top-right",
        });
      }
      setExist("");
    } catch (error) {
      if (error.response?.status === 409) {
        setExist(error.response.data.msg);
        toast.warning("Student already enrolled!", {
          position: "top-right",
        });
      }
      console.error("Failed to add enrollment", error);
    }
  };

  const fetchStudentData = async () => {
    try {
      const studentData = await getStudentByEmail(axiosCustom, email);
      setStudent(studentData);
      setNotFound("");
    } catch (error) {
      if (error.response?.status === 404) {
        setNotFound("Student not found");
        setStudent(null);
      }
      console.error("Failed to fetch student data", error);
    }
  };

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Activity details</h2>
        <div className={styles.activityDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Name:</span>
            <span className={styles.detailValue}>{activity.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Professor:</span>
            <span className={styles.detailValue}>{activity.user?.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Course:</span>
            <span className={styles.detailValue}>{activity.course?.name}</span>
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Add student</h2>
        <div className={styles.enrollmentSection}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Search Student by Email:
            </label>
            <div>
              <input
                className={styles.input}
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className={`${styles.button} ${styles.searchButton}`}
                onClick={fetchStudentData}
              >
                Search
              </button>
            </div>
          </div>

          {student ? (
            <div className={styles.studentCard}>
              <p className={styles.studentName}>{student.name}</p>
              <button className={styles.button} onClick={onAddEnrollment}>
                Add
              </button>
            </div>
          ) : (
            notFound && <p className={styles.errorMessage}>{notFound}</p>
          )}

          {exist.length > 0 && <p className={styles.errorMessage}>{exist}</p>}
        </div>

        <h2 className={styles.sectionTitle}>Enrolled Students</h2>
        <div className={styles.enrollmentSection}>
          {enrollments.length > 0 ? (
            <ul className={styles.enrollmentsList}>
              {enrollments.map((e) => (
                <li className={styles.enrollmentItem} key={e.uuid}>
                  {e.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyMessage}>
              You haven't added any students yet.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default ActivityEnrollment;
