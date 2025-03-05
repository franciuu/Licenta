import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";

const ViewActivity = () => {
  const [activity, setActivity] = useState({});
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const getActivity = async () => {
    try {
      const response = await axiosCustom.get(`/activities/${id}`);
      setActivity(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      navigate("/", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <Layout>
      <h1>{activity.name}</h1>
      <p>{`Room: ${activity.room}`}</p>
      <p>{activity.startTime}</p>
      <p>{activity.endTime}</p>
      <p>{activity.idCourse}</p>
      <p>{activity.idProf}</p>
    </Layout>
  );
};
export default ViewActivity;
