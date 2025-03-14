import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import CourseCard from "../components/CourseCard.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { getCourses } from "../services/CourseService.js";
import Loader from "../components/Loader.js";

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
      <button>
        <Link to="/courses/add">Add Course</Link>
      </button>
      {courses?.length ? (
        <Container className="mt-4">
          <Row>
            {courses.map((course) => (
              <Col
                key={course.uuid}
                xs={12}
                sm={6}
                md={6}
                lg={3}
                className="mb-4"
              >
                <CourseCard info={course} />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <p>No courses to display</p>
      )}
    </Layout>
  );
};
export default Courses;
