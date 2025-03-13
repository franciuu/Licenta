import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import CourseCard from "../components/CourseCard.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { getCourses } from "../services/CourseService.js";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      }
    };

    fetchCoursesData();
  }, [axiosCustom]);

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
