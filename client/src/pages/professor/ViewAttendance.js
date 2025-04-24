import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import { FiAlertCircle, FiCheck, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Loader from "../../components/Loader";
import {
  getAttendancesByActivityAndDate,
  getAttendanceCount,
} from "../../services/AttendanceService";
import { getActivityById } from "../../services/ActivityService";
import { getActivityStudents } from "../../services/StudentService";
import { sendMail } from "../../services/MailService";
import useAuth from "../../hooks/useAuth";
import styles from "../../styles/ViewAttendance.module.css";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [activity, setActivity] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [attendancesCount, setAttendancesCount] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sending, setSending] = useState(false);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students);
    }
  };

  const handleStudentSelect = (student) => {
    if (selectedStudents.find((s) => s.uuid === student.uuid)) {
      setSelectedStudents(
        selectedStudents.filter((s) => s.uuid !== student.uuid)
      );
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const onSend = async (
    selectedStudents,
    attendancesCount,
    activityName,
    professorName,
    professorEmail
  ) => {
    try {
      setSending(true);
      const mailData = await sendMail(
        axiosCustom,
        selectedStudents,
        attendancesCount,
        activityName,
        professorName,
        professorEmail
      );
      setSelectedStudents([]);
      if (mailData) {
        toast.success("Emails sent successfully!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Failed to send emails. Please try again later.", {
        position: "top-right",
      });
      console.error(error);
    } finally {
      setSending(false);
    }
  };

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
    console.log(students);
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
  }, [selectedDate]);

  useEffect(() => {
    setSelectedStudents([]);
  }, [id]);

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.pageContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>{activity.name}</h1>
          <h2 className={styles.pageSubtitle}>
            {activity.semester?.name} {activity.semester?.academic_year?.name}
          </h2>
        </div>

        <div className={styles.attendanceCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{`Attendance for ${dateFormat(
              selectedDate,
              "dd-mm-yyyy"
            )}`}</h3>
            <p className={styles.cardDescription}>{`${
              attendances.length === 0
                ? "No students"
                : attendances.length === 1
                ? "1 present student"
                : `${attendances.length} present students`
            }`}</p>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.dateSelectorContainer}>
              <label
                className={styles.dateSelectorLabel}
                htmlFor="activityDate"
              >
                Select a date:
              </label>
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

            <div className={styles.attendanceResults}>
              {attendances?.length ? (
                <div className={styles.attendanceList}>
                  <div className={styles.attendanceListContainer}>
                    <h3 className={styles.attendanceListTitle}>
                      Present students:
                    </h3>
                    <div className={styles.attendanceItems}>
                      {attendances.map((student, index) => (
                        <div key={index} className={styles.attendanceItem}>
                          <FiCheck className={styles.checkIcon} />
                          <div>
                            <div className={styles.studentName}>
                              {student.name}
                            </div>
                            <div
                              className={styles.arrivalTime}
                            >{`Arrival Time: ${student.arrivalTime}`}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.alertInfo}>
                  <FiAlertCircle className={styles.alertIcon} />
                  <h4 className={styles.alertDescription}>
                    Looks like no one was marked present on this day.
                  </h4>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.studentsCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleWithButton}>
              <span>Students List</span>
              <button
                type="button"
                disabled={selectedStudents.length === 0 || sending}
                className={styles.sendEmailButton}
                onClick={() =>
                  onSend(
                    selectedStudents,
                    attendancesCount,
                    activity.name,
                    auth?.name,
                    auth?.email
                  )
                }
              >
                <FiMail className={styles.buttonIcon} />
                {sending
                  ? "Sending..."
                  : `Send Mail (${selectedStudents.length})`}
              </button>
            </div>
            <p className={styles.cardDescription}>
              Select students to send emails with their total attendance count.
            </p>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.studentListContainer}>
              <div className={styles.studentsListHeader}>
                <div className={styles.selectAllContainer}>
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectedStudents.length === students.length}
                    onChange={handleSelectAllStudents}
                    className={styles.formCheckbox}
                  ></input>
                  <label htmlFor="selectAll" className={styles.checkboxLabel}>
                    Select all
                  </label>
                </div>
                <div className="selectionCount">
                  {selectedStudents.length} of {students.length} selected
                </div>
              </div>

              <div className={`${styles.studentsList} ${styles.scrollable}`}>
                {students.map((student) => (
                  <div key={student.uuid} className={styles.studentItem}>
                    <input
                      type="checkbox"
                      id={`student-${student.uuid}`}
                      checked={selectedStudents.some(
                        (s) => s.uuid === student.uuid
                      )}
                      onChange={() => handleStudentSelect(student)}
                      className={styles.formCheckbox}
                    />
                    <div className={styles.studentDetails}>
                      <div className={styles.studentName}>{student.name}</div>
                      <div className={styles.studentEmail}>{student.email}</div>
                    </div>
                    <div className={styles.attendanceCountContainer}>
                      <span className={styles.attendanceCount}>
                        Prezențe: {attendancesCount[student.uuid]}/
                        {activity.availableDates?.length}
                      </span>
                      {attendancesCount[student.uuid] ===
                        activity.availableDates?.length && (
                        <span className={styles.attendanceComplete}>
                          <FiCheck className={styles.completeIcon} />
                          Complet
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ViewAttendance;
