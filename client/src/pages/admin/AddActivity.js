import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Layout from "../Layout.js";
import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getCourses } from "../../services/CourseService.js";
import { getProfessors } from "../../services/UserService.js";
import { createActivity } from "../../services/ActivityService.js";
import { getSemesters } from "../../services/AcademicYearService.js";
import { getRooms } from "../../services/RoomService.js";
import Loader from "../../components/Loader.js";
import styles from "../../styles/AddActivity.module.css";

const timeToMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const addActivitySchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  idCourse: Yup.string().required("Course is required."),
  idProf: Yup.string().required("Professor is required."),
  idSemester: Yup.string().required("Semester is required."),
  idRoom: Yup.string().required("Room is required."),
  dayOfWeek: Yup.number()
    .typeError("Day of week must be a number.")
    .transform((value, originalValue) => Number(originalValue))
    .min(0, "Invalid day.")
    .max(6, "Invalid day.")
    .required("Day of week is required."),
  type: Yup.string()
    .oneOf(["lecture", "seminar"], "Type must be seminar or lecture.")
    .required("Type is required."),
  startTime: Yup.string().required("Start time is required."),
  endTime: Yup.string()
    .required("End time is required.")
    .test(
      "is-after-start",
      "End time must be after start time.",
      function (value) {
        const { startTime } = this.parent;
        return (
          !startTime ||
          !value ||
          timeToMinutes(value) > timeToMinutes(startTime)
        );
      }
    ),
});

const AddActivity = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    startTime: "",
    endTime: "",
    idRoom: "",
    idCourse: "",
    idProf: "",
    dayOfWeek: "0",
    idSemester: "",
    type: "seminar",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addActivitySchema),
    defaultValues,
  });

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [semData, coursesData, profsData, roomsData] = await Promise.all([
          getSemesters(axiosCustom),
          getCourses(axiosCustom),
          getProfessors(axiosCustom),
          getRooms(axiosCustom),
        ]);
        setSemesters(semData);
        setCourses(coursesData);
        setProfs(profsData);
        setRooms(roomsData);

        setDefaultValues({
          name: "",
          startTime: "",
          endTime: "",
          idRoom: roomsData[0]?.uuid || "",
          idCourse: coursesData[0]?.uuid || "",
          idProf: profsData[0]?.uuid || "",
          dayOfWeek: "0",
          idSemester: semData[0]?.uuid || "",
          type: "seminar",
        });

        reset({
          name: "",
          startTime: "",
          endTime: "",
          idRoom: roomsData[0]?.uuid || "",
          idCourse: coursesData[0]?.uuid || "",
          idProf: profsData[0]?.uuid || "",
          dayOfWeek: "0",
          idSemester: semData[0]?.uuid || "",
          type: "seminar",
        });
      } catch (err) {
        setError("Failed to fetch initial data.");
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [axiosCustom, reset]);

  const onSubmit = async (data) => {
    setError(null);
    try {
      await createActivity(axiosCustom, data);
      navigate(`/admin/courses/${data.idCourse}`);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          err.response?.data?.errors?.[0]?.msg ||
          "An unexpected error occurred"
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.addActivityContainer}>
        <h2 className={styles.addActivityTitle}>Add Activity</h2>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formGroupFullWidth}>
            <label htmlFor="name">Name: </label>
            <input
              {...register("name")}
              id="name"
              placeholder="e.g. Baze de date, Tip-S, 1092"
              autoFocus
            />
            {errors.name && (
              <p className={styles.error}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="idCourse">Course: </label>
                <select {...register("idCourse")} id="idCourse">
                  {courses.map((c) => (
                    <option key={c.uuid} value={c.uuid}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.idCourse && (
                  <p className={styles.error}>{errors.idCourse.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idRoom">Room: </label>
                <select {...register("idRoom")} id="idRoom">
                  {rooms.map((r) => (
                    <option key={r.uuid} value={r.uuid}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.idRoom && (
                  <p className={styles.error}>{errors.idRoom.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="startTime">Start time:</label>
                <input {...register("startTime")} id="startTime" type="time" />
                {errors.startTime && (
                  <p className={styles.error}>{errors.startTime.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dayOfWeek">Day of week: </label>
                <select {...register("dayOfWeek")} id="dayOfWeek">
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
                {errors.dayOfWeek && (
                  <p className={styles.error}>{errors.dayOfWeek.message}</p>
                )}
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label htmlFor="type">Type: </label>
                <select {...register("type")} id="type">
                  <option value="seminar">Seminar</option>
                  <option value="lecture">Lecture</option>
                </select>
                {errors.type && (
                  <p className={styles.error}>{errors.type.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idProf">Professor: </label>
                <select {...register("idProf")} id="idProf">
                  {profs.map((p) => (
                    <option key={p.uuid} value={p.uuid}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.idProf && (
                  <p className={styles.error}>{errors.idProf.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime">End time:</label>
                <input {...register("endTime")} id="endTime" type="time" />
                {errors.endTime && (
                  <p className={styles.error}>{errors.endTime.message}</p>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="idSemester">Semester: </label>
                <select {...register("idSemester")} id="idSemester">
                  {semesters.map((s) => (
                    <option key={s.uuid} value={s.uuid}>
                      {s.name} - {s.academic_year?.name || ""}
                    </option>
                  ))}
                </select>
                {errors.idSemester && (
                  <p className={styles.error}>{errors.idSemester.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || loading}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddActivity;
