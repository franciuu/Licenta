import { useEffect, useState } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getStudentsCount } from "../../services/StudentService";
import {
  getActivitiesCount,
  getPersonalActivities,
  getLectures,
} from "../../services/ActivityService";
import { getPersonalCourses } from "../../services/CourseService";
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
        const coursesData = await getPersonalCourses(axiosCustom);
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
      <div className="min-h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-7.5rem)] flex flex-col lg:bg-gray-50">
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 p-3">
          <div className="flex flex-col lg:col-span-4 lg:grid lg:grid-rows-2 gap-3 lg:h-full">
            <StatsSection
              studCount={studCount}
              activCount={activCount}
              auth={auth}
              className="lg:row-span-1"
            />
            <AttendancePieChart
              selectedLecture={selectedLecture}
              setSelectedLecture={setSelectedLecture}
              lectures={lectures}
              className="lg:row-span-1"
            />
          </div>

          <div className="flex flex-col lg:col-span-8 lg:grid lg:grid-rows-2 gap-3 lg:h-full">
            <WeeklyAttendanceChart
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              activities={activities}
              className="lg:row-span-1"
            />
            <SeminarAttendanceChart
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              courses={courses}
              className="lg:row-span-1"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
