import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import Layout from "../Layout";
import CourseCard from "../../components/admin/CourseCard.js";
import FilterBar from "../../components/admin/FilterBar.js";
import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getCourses } from "../../services/CourseService.js";
import Loader from "../../components/Loader.js";
import styles from "../../styles/Courses.module.css";

const Courses = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    programLevel: "",
  });
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchCoursesData = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchCoursesData();
  }, [axiosCustom]);

  useEffect(() => {
    let result = [...courses];

    if (filters.name) {
      result = result.filter((course) =>
        course.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.programLevel) {
      result = result.filter(
        (course) => course.programLevel === filters.programLevel
      );
    }

    setFilteredCourses(result);
  }, [filters, courses]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
              <span className={styles.addIcon}>+</span>
              Add course
            </Link>
          </button>
        </div>

        <div className={styles.filterSection}>
          <FilterBar onFilterChange={handleFilterChange} />
          <span className={styles.resultsCount}>
            Showing {filteredCourses.length} of {courses.length} courses
          </span>
        </div>

        {filteredCourses?.length ? (
          <Row className={styles.coursesList}>
            {filteredCourses.map((course) => (
              <Col
                key={course.uuid}
                xs={12}
                sm={6}
                md={6}
                lg={4}
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
            <p className={styles.noCoursesText}>
              No courses match your filters
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
