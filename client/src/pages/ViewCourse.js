import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout from "./Layout";
import ActivityCard from "../components/ActivityCard.js";
import Swal from "sweetalert2";

const ViewCourse = () => {
  const [course, setCourse] = useState({});
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const getCourse = async () => {
    try {
      const response = await axiosCustom.get(`/courses/${id}`);
      setCourse(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
      navigate("/", { state: { from: location }, replace: true });
    }
  };

  const getActivities = async () => {
    try {
      const response = await axiosCustom.get(`/activities/course/${id}`);
      setActivities(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching activities:",
        error.response?.data || error.message
      );
    }
  };

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
          navigate("/courses");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    getCourse();
    getActivities();
  }, []);
  return (
    <Layout>
      <h1>{course.name}</h1>
      <p>{course.programLevel}</p>
      <button onClick={() => deleteCourse(course.uuid)}>Delete course</button>
      <Container className="mt-4">
        <Row>
          {activities.map((activ) => (
            <Col key={activ.uuid} xs={12} sm={6} md={6} lg={3} className="mb-4">
              <ActivityCard info={activ} />
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};
export default ViewCourse;
