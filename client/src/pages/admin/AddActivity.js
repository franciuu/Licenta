import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../Layout.js";
import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getCourses } from "../../services/CourseService.js";
import { getProfessors } from "../../services/UserService.js";
import { createActivity } from "../../services/ActivityService.js";
import { getSemesters } from "../../services/AcademicYearService.js";
import { getRooms } from "../../services/RoomService.js";
import Loader from "../../components/Loader.js";
import ActivityForm from "../../components/admin/ActivityForm.js";

const AddActivity = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch (err) {
        setError("Failed to fetch initial data.");
        console.error("Failed to fetch initial data", err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [axiosCustom]);

  const onSubmit = async (data) => {
    setError(null);
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
      <ActivityForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        courses={courses}
        profs={profs}
        semesters={semesters}
        rooms={rooms}
        error={error}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
};

export default AddActivity;
