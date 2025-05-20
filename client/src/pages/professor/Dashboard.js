import { useEffect, useState } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getStudentsCount } from "../../services/StudentService";
import {
  getActivitiesCount,
  getPersonalActivities,
  getLectures,
} from "../../services/ActivityService";
import { getCourses } from "../../services/CourseService";
import useAuth from "../../hooks/useAuth";

import StatsSection from "../../components/professor/StatsSection";
import AttendancePieChart from "../../components/professor/AttendancePieChart";
import SeminarAttendanceChart from "../../components/professor/SeminarAttendanceChart";
import WeeklyAttendanceChart from "../../components/professor/WeeklyAttendanceChart";

const Dashboard = () => {
  const [studCount, setStudCount] = useState(0);
  const [activCount, setActivCount] = useState(0);

  const [activities, setActivities] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);

  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedLecture, setSelectedLecture] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const axiosCustom = useAxiosCustom();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const studentCount = await getStudentsCount(axiosCustom);
        setStudCount(studentCount);
      } catch (error) {
        console.error("Failed to fetch stud count", error);
      }
    };

    const fetchActivitiesCount = async () => {
      try {
        const activCount = await getActivitiesCount(axiosCustom);
        setActivCount(activCount);
      } catch (error) {
        console.error("Failed to fetch activ count", error);
      }
    };

    const fetchActivities = async () => {
      try {
        const activitiesData = await getPersonalActivities(axiosCustom);
        setActivities(activitiesData);
        setSelectedActivity(activitiesData[0]?.uuid);
      } catch (error) {
        console.error("Failed to fetch activities data", error);
      }
    };

    const fetchLectures = async () => {
      try {
        const lecturesData = await getLectures(axiosCustom);
        setLectures(lecturesData);
        setSelectedLecture(lecturesData[0]?.uuid);
      } catch (error) {
        console.error("Failed to fetch lectures data", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
        setSelectedCourse(coursesData[0]?.uuid);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      }
    };

    fetchCourses();
    fetchLectures();
    fetchActivities();
    fetchActivitiesCount();
    fetchStudentCount();
  }, [axiosCustom]);

  return (
    <Layout>
      <div className="h-[calc(100vh-7.5rem)] flex flex-col bg-gray-50">
        <div className="flex-1 grid grid-cols-12 gap-3 p-3">
          <div className="col-span-4 grid grid-rows-2 gap-3 h-full">
            <StatsSection
              studCount={studCount}
              activCount={activCount}
              auth={auth}
              className="row-span-1"
            />
            <AttendancePieChart
              selectedLecture={selectedLecture}
              setSelectedLecture={setSelectedLecture}
              lectures={lectures}
              className="row-span-1"
            />
          </div>

          <div className="col-span-8 grid grid-rows-2 gap-3 h-full">
            <WeeklyAttendanceChart
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              activities={activities}
              className="row-span-1"
            />
            <SeminarAttendanceChart
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              courses={courses}
              className="row-span-1"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
