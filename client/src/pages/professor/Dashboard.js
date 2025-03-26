import { useState, useEffect } from "react";
import { Icon } from "@chakra-ui/react";
import { FaTasks, FaUserGraduate } from "react-icons/fa";
import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "../Layout";
import useAuth from "../../hooks/useAuth";
import { getStudentsCount } from "../../services/StudentService";
import {
  getActivitiesCount,
  getPersonalActivities,
  getLectures,
} from "../../services/ActivityService";
import {
  getAttendanceTrendForActivity,
  getAttendancePercentageForLecture,
  getSeminarAttendancePercentageForCourse,
} from "../../services/AttendanceService";
import { getCourses } from "../../services/CourseService";
import styles from "../../styles/Dashboard.module.css";
import useAxiosCustom from "../../hooks/useAxiosCustom";

const Dashboard = () => {
  const [studCount, setStudCount] = useState(0);
  const [activCount, setActivCount] = useState(0);

  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

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

  useEffect(() => {
    const fetchBarChart = async () => {
      if (!selectedCourse) return;
      try {
        const barData = await getSeminarAttendancePercentageForCourse(
          axiosCustom,
          selectedCourse
        );
        setBarData(barData);
      } catch (error) {
        console.error("Failed to fetch bar chart data", error);
      }
    };

    fetchBarChart();
  }, [axiosCustom, selectedCourse]);

  useEffect(() => {
    const fetchLineChart = async () => {
      if (!selectedActivity) return;
      try {
        const lineData = await getAttendanceTrendForActivity(
          axiosCustom,
          selectedActivity
        );
        setLineData(lineData);
      } catch (error) {
        console.error("Failed to fetch line chart data", error);
      }
    };

    fetchLineChart();
  }, [axiosCustom, selectedActivity]);

  useEffect(() => {
    const fetchPieData = async () => {
      if (!selectedLecture) return;
      try {
        const pieData = await getAttendancePercentageForLecture(
          axiosCustom,
          selectedLecture
        );
        setPieData(pieData);
      } catch (error) {
        console.error("Failed to fetch attendance percentage", error);
      }
    };

    fetchPieData();
  }, [axiosCustom, selectedLecture]);

  const COLORS = ["#8e44ad", "#ce98e6"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="10"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Layout>
      <div className={styles.dashboardContainer}>
        <div className={styles.topSection}>
          <div className={styles.greeting}>Hello, {auth.name}!</div>
          <div className={styles.statsWrapper}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total activities</span>
                <Icon as={FaTasks} className={styles.statIcon} />
              </div>
              <div className={styles.statValue}>{activCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statLabel}>Total students</span>
                <Icon as={FaUserGraduate} className={styles.statIcon} />
              </div>
              <div className={styles.statValue}>{studCount}</div>
            </div>
          </div>
        </div>

        <div className={styles.chartPie}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              Average Attendance per Course
            </div>
            <select
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
              className={styles.chartSelect}
            >
              {lectures.map((l) => (
                <option key={l.uuid} value={l.uuid}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Legend
                  layout="vertical"
                  align="left"
                  verticalAlign="middle"
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: "#2d2d2d" }}>{value}</span>
                  )}
                />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={70}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartSeminar}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>
              Seminar Attendance Comparison
            </div>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className={styles.chartSelect}
            >
              {courses.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={barData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(name) => name.split(" ").pop()}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="percentage"
                  barSize={25}
                  fill="#8E24AA"
                  label={{
                    position: "top",
                    formatter: (value) => `${value}%`,
                    fill: "#333",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#999"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 3"
                  strokeOpacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartActivity}>
          <div className={styles.chartHeader}>
            <div className={styles.chartTitle}>Weekly Attendance Trend</div>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className={styles.chartSelect}
            >
              {activities.map((a) => (
                <option key={a.uuid} value={a.uuid}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="presentCount"
                  stroke="#8E24AA"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
