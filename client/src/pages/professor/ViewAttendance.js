import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Loader from "../../components/Loader";
import { getAttendanceCount } from "../../services/AttendanceService";
import { getActivityById } from "../../services/ActivityService";
import { getActivityStudents } from "../../services/StudentService";
import StudentEmailList from "../../components/professor/StudentEmailList";
import AttendanceDisplay from "../../components/professor/AttendanceDisplay";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [activity, setActivity] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [attendancesCount, setAttendancesCount] = useState([]);
  const [students, setStudents] = useState([]);

  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchActivity = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const activityData = await getActivityById(axiosCustom, id);
        setActivity(activityData);
        setSelectedDate(activityData.availableDates[0] || "");
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/404");
        }
        console.error("Failed to fetch activity data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    const fetchStudents = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const studentsData = await getActivityStudents(axiosCustom, id);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch students data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    const fetchCounts = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const countsData = await getAttendanceCount(axiosCustom, id);
        setAttendancesCount(countsData);
      } catch (error) {
        console.error("Failed to fetch attendance count data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchActivity();
    fetchStudents();
    fetchCounts();
  }, [axiosCustom, id]);

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {activity.name}
          </h1>
          <h2 className="text-lg text-gray-600">
            {activity.semester?.name} {activity.semester?.academic_year?.name}
          </h2>
        </div>

        <div className="mb-8">
          <AttendanceDisplay
            activityId={id}
            activity={activity}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div>
          <StudentEmailList
            activityId={id}
            activityName={activity?.name}
            students={students}
            attendancesCount={attendancesCount}
            availableDates={activity?.availableDates || []}
          />
        </div>
      </div>
    </Layout>
  );
};
export default ViewAttendance;
