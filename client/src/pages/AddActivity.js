import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../pages/Layout.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { getCourses } from "../services/CourseService.js";
import { getProfessors } from "../services/UserService.js";
import { createActivity } from "../services/ActivityService.js";
import Loader from "../components/Loader.js";

const AddActivity = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    room: "2013A",
    idCourse: "",
    idProf: "",
    dayOfWeek: "0",
  });
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCount((prev) => prev + 1);
    try {
      const activityData = await createActivity(axiosCustom, formData);
      if (activityData) {
        navigate(`/admin/courses/${formData.idCourse}`);
      }
    } catch (error) {
      console.error("Failed to create activity", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
        setFormData((prev) => ({
          ...prev,
          idCourse: coursesData[0]?.uuid || "",
        }));
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    const fetchProfs = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const profsData = await getProfessors(axiosCustom);
        setProfs(profsData);
        setFormData((prev) => ({
          ...prev,
          idProf: profsData[0]?.uuid || "",
        }));
      } catch (error) {
        console.error("Failed to fetch professors data", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

    fetchCourses();
    fetchProfs();
  }, [axiosCustom]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="startTime">Start time:</label>
          <input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="endTime">End time:</label>
          <input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="dayOfWeek">Day of week: </label>
          <select
            id="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
          </select>
        </div>

        <div>
          <label htmlFor="room">Room: </label>
          <select id="room" value={formData.room} onChange={handleChange}>
            <option value="2013A">2013A</option>
            <option value="2001D">2001D</option>
          </select>
        </div>

        <div>
          <label htmlFor="idCourse">Course: </label>
          <select
            id="idCourse"
            value={formData.idCourse}
            onChange={handleChange}
          >
            {courses.map((c) => (
              <option key={c.uuid} value={c.uuid}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="idProf">Professor: </label>
          <select id="idProf" value={formData.idProf} onChange={handleChange}>
            {profs.map((p) => (
              <option key={p.uuid} value={p.uuid}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Save</button>
      </form>
    </Layout>
  );
};

export default AddActivity;
