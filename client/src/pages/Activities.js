import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "./Layout";
import ActivityCard from "../components/ActivityCard.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const axiosCustom = useAxiosCustom();

  const getActivities = async () => {
    try {
      const response = await axiosCustom.get("/activities");
      setActivities(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error fetching activities:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <Layout>
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
export default Activities;
