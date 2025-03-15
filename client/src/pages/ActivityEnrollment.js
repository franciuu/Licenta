import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { getActivityById } from "../services/ActivityService";
import { axiosCustom } from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getStudentByEmail } from "../services/StudentService";

const ActivityEnrollment = () => {
  const [activity, setActivity] = useState({});
  const [email, setEmail] = useState("");
  const [notFound, setNotFound] = useState("");
  const [student, setStudent] = useState(null);
  const [loadingCount, setLoadingCount] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

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
  }, []);

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
      <h2>Activity details</h2>
      {activity.name}
      <p>Start time: {activity.startTime}</p>
      <p>End time: {activity.endTime}</p>
      <p>Room: {activity.room}</p>
      <p>Profesor: {activity.user?.name}</p>
      <p>Curs: {activity.course?.name}</p>
      <h2>Add student</h2>
      <label htmlFor="email">Search Student by Email:</label>
      <input
        type="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={fetchStudentData}>Search</button>
      {student ? <p>{student.name}</p> : <p>{notFound}</p>}
    </Layout>
  );
};
export default ActivityEnrollment;
