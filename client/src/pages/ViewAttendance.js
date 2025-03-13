import { useState, useEffect } from "react";
import Layout from "./Layout";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useParams } from "react-router-dom";
import AttendaceList from "../components/AttendanceList.js";

const ViewAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams();

  const getAttendances = async () => {
    try {
      const response = await axiosCustom.get(`/attendances/${id}`);
      setAttendances(response.data);
    } catch (error) {
      console.error(
        "Error fetching activities:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getAttendances();
  }, []);

  return (
    <Layout>
      <p>{id}</p>
      <AttendaceList />
    </Layout>
  );
};
export default ViewAttendance;
