import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import CourseCard from "../components/CourseCard.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axiosCustom.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.error(
          "Error fetching courses:",
          error.response?.data || error.message
        );
      }
    };

    getCourses();
  }, []);

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
