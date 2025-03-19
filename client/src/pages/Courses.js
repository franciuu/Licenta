import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import CourseCard from "../components/CourseCard.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { getCourses } from "../services/CourseService.js";
import Loader from "../components/Loader.js";
import styles from "../styles/Courses.module.css";

const Courses = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchCoursesData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchCoursesData();
  }, [axiosCustom]);

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.coursesContainer}>
        <div className={styles.coursesHeader}>
          <h1 className={styles.coursesTitle}>List of Courses</h1>
          <button className={styles.addCourseBtn}>
            <Link to="/admin/courses/add" className={styles.addCourseBtnLink}>
              Add new course
            </Link>
          </button>
        </div>

        {courses?.length ? (
          <Row className={styles.coursesList}>
            {courses.map((course) => (
              <Col
                key={course.uuid}
                xs={12}
                sm={6}
                md={6}
                lg={3}
                className={styles.courseColumn}
              >
                <div className={styles.courseCardWrapper}>
                  <CourseCard info={course} />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className={styles.noCourses}>
            <p className={styles.noCoursesText}>No courses to display</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
