import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import ActivityCard from "../../components/ActivityCard.js";
import Swal from "sweetalert2";
import { getCourseById } from "../../services/CourseService.js";
import { getActivitesByCourse } from "../../services/ActivityService.js";
import Loader from "../../components/Loader.js";
import styles from "../../styles/ViewCourse.module.css";

const ViewCourse = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [course, setCourse] = useState({});
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  const deleteCourse = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosCustom.delete(`/courses/${uuid}`);
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
          navigate("/admin/courses");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const courseData = await getCourseById(axiosCustom, id);
        setCourse(courseData);
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/404");
        }
        console.error("Failed to fetch course data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    const fetchActivitiesData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const activitiesData = await getActivitesByCourse(axiosCustom, id);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch activities data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchCourseData();
    fetchActivitiesData();
  }, [navigate, axiosCustom, id]);

  const renderActivities = () => {
    if (activities.length === 0) {
      return (
        <div className={styles.noActivitiesMessage}>
          <div className={styles.noActivitiesIcon}>📚</div>
          <p>No activities available for this course yet.</p>
        </div>
      );
    }

    return (
      <Container fluid>
        <Row>
          {activities.map((activ) => (
            <Col key={activ.uuid} xs={12} sm={6} md={6} lg={3} className="mb-4">
              <ActivityCard info={activ} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.courseContainer}>
        <div className={styles.courseHeader}>
          <div>
            <h1 className={styles.courseTitle}>{course.name}</h1>
            <p className={styles.courseLevel}>{course.programLevel}</p>
          </div>
          <button
            className={styles.deleteButton}
            onClick={() => deleteCourse(course.uuid)}
          >
            Delete course
          </button>
        </div>

        <div className={styles.activitiesContainer}>
          <h2 className={styles.activitiesTitle}>Course Activities</h2>
          {renderActivities()}
        </div>
      </div>
    </Layout>
  );
};
export default ViewCourse;
