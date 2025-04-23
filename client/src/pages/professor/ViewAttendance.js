import { useState, useEffect, useMemo } from "react";
import dateFormat from "dateformat";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAttendancesByActivityAndDate } from "../../services/AttendanceService";
import { getActivityById } from "../../services/ActivityService";
import { FiAlertCircle, FiCheck, FiMail } from "react-icons/fi";
import styles from "../../styles/ViewAttendance.module.css";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [activity, setActivity] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [attendances, setAttendances] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const { id } = useParams();

  const MOCK_STUDENTS = [
    {
      id: 1,
      name: "Popescu Ion",
      email: "popescu.ion@example.com",
      attendances: [true, true, false, true, true, false],
    },
    {
      id: 2,
      name: "Ionescu Maria",
      email: "ionescu.maria@example.com",
      attendances: [true, false, true, true, false, true],
    },
    {
      id: 3,
      name: "Dumitrescu Andrei",
      email: "dumitrescu.andrei@example.com",
      attendances: [true, true, true, false, true, true],
    },
    {
      id: 4,
      name: "Constantinescu Elena",
      email: "constantinescu.elena@example.com",
      attendances: [true, true, true, true, true, true],
    },
    {
      id: 5,
      name: "Popa Alexandru",
      email: "popa.alexandru@example.com",
      attendances: [true, false, true, true, false, false],
    },
    {
      id: 6,
      name: "Stanescu Mihai",
      email: "stanescu.mihai@example.com",
      attendances: [true, true, false, false, true, false],
    },
    {
      id: 7,
      name: "Georgescu Ana",
      email: "georgescu.ana@example.com",
      attendances: [true, true, true, true, false, true],
    },
    {
      id: 8,
      name: "Vasilescu Radu",
      email: "vasilescu.radu@example.com",
      attendances: [true, false, false, true, true, true],
    },
    {
      id: 9,
      name: "Marinescu Diana",
      email: "marinescu.diana@example.com",
      attendances: [true, true, true, false, false, true],
    },
    {
      id: 10,
      name: "Diaconu Cristian",
      email: "diaconu.cristian@example.com",
      attendances: [true, true, true, true, true, false],
    },
    {
      id: 11,
      name: "Stoica Alina",
      email: "stoica.alina@example.com",
      attendances: [true, false, true, true, true, true],
    },
    {
      id: 12,
      name: "Munteanu Victor",
      email: "munteanu.victor@example.com",
      attendances: [true, true, false, true, false, true],
    },
  ];

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === MOCK_STUDENTS.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(MOCK_STUDENTS.map((student) => student.id));
    }
  };

  const handleStudentSelect = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const getAttendanceCount = (studentId) => {
    const student = MOCK_STUDENTS.find((s) => s.id === studentId);
    if (!student) return 0;
    return 6;
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
                      {attendances.map((student) => (
                        <div
                          key={student.uuid}
                          className={styles.attendanceItem}
                        >
                          <FiCheck className={styles.checkIcon} />
                          <div className={styles.studentName}>
                            {student.name}
                          </div>
                          <div
                            className={styles.arrivalTime}
                          >{`Arrival Time: ${student.arrivalTime}`}</div>
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
                disabled={selectedStudents.length === 0}
                className={styles.sendEmailButton}
              >
                <FiMail />
                Send Mail ({selectedStudents.length})
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
                    checked={selectedStudents.length === MOCK_STUDENTS.length}
                    onChange={handleSelectAllStudents}
                    className={styles.formCheckbox}
                  ></input>
                  <label htmlFor="selectAll" className={styles.checkboxLabel}>
                    Select all
                  </label>
                </div>
                <div className="selectionCount">
                  {selectedStudents.length} din {MOCK_STUDENTS.length} selectați
                </div>
              </div>

              <div className={`${styles.studentsList} ${styles.scrollable}`}>
                {MOCK_STUDENTS.map((student) => (
                  <div key={student.id} className={styles.studentItem}>
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className={styles.formCheckbox}
                    />
                    <div className={styles.studentDetails}>
                      <div className={styles.studentName}>{student.name}</div>
                      <div className={styles.studentEmail}>{student.email}</div>
                    </div>
                    <div className={styles.attendanceCountContainer}>
                      <span className={styles.attendanceCount}>
                        Prezențe: {getAttendanceCount(student.id)}/
                        {activity.availableDates?.length}
                      </span>
                      {getAttendanceCount(student.id) ===
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
