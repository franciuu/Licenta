import { useState, useEffect, useMemo } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useParams, useNavigate } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Loader from "../../components/Loader";
import { getAttendancesByActivityAndDate } from "../../services/AttendanceService";
import { getActivityById } from "../../services/ActivityService";
import styles from "../../styles/ViewAttendance.module.css";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [activity, setActivity] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [attendances, setAttendances] = useState([]);
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

    fetchActivity();
  }, [axiosCustom, id]);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchAttendances = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const attendancesData = await getAttendancesByActivityAndDate(
          axiosCustom,
          id,
          selectedDate
        );
        setAttendances(attendancesData);
      } catch (error) {
        console.error("Failed to fetch attendances data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchAttendances();
  }, [selectedDate, axiosCustom, id]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableColumnOrdering: false,
      },
      {
        accessorKey: "arrivalTime",
        header: "Arrival Time",
      },
    ],
    []
  );
  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>{activity.name}</h1>
        <p className={styles.subTitle}>{activity.semester?.name}</p>
        <p className={styles.subTitle}>
          {activity.semester?.academic_year?.name}
        </p>

        <div className={styles.datePicker}>
          <label htmlFor="activityDate">Date:</label>
          <select
            id="activityDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.select}
          >
            {(activity.availableDates || []).map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {attendances?.length ? (
          <MaterialReactTable
            columns={columns}
            data={attendances}
            enablePagination
            enableColumnOrdering
          />
        ) : (
          <p className={styles.noAttendanceMessage}>
            Looks like no one was marked present on this day.
          </p>
        )}
      </div>
    </Layout>
  );
};
export default ViewAttendance;
