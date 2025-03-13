import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../pages/Layout.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";
import { getCourses } from "../services/CourseService.js";
import { getProfessors } from "../services/UserService.js";
import { createActivity } from "../services/ActivityService.js";

const AddActivity = () => {
  const [courses, setCourses] = useState([]);
  const [profs, setProfs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    room: "",
    idCourse: "",
    idProf: "",
    dayOfWeek: "",
  });
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createActivity(axiosCustom, formData);
      if (response) {
        navigate(`/courses/${formData.idCourse}`);
      }
    } catch (error) {
      console.error("Failed to create activity", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses(axiosCustom);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch courses data", error);
      }
    };

    const fetchProfs = async () => {
      try {
        const profsData = await getProfessors(axiosCustom);
        setProfs(profsData);
      } catch (error) {
        console.error("Failed to fetch professors data", error);
      }
    };

    fetchCourses();
    fetchProfs();
  }, [axiosCustom]);

  const handleChange = (e) => {
    console.log(e.target.id);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name: </label>
          <input id="name" placeholder="Name" onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="startTime">Start time:</label>
          <input id="startTime" type="time" onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="endTime">End time:</label>
          <input id="endTime" type="time" onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="dayOfWeek">Day of week: </label>
          <select id="dayOfWeek" onChange={handleChange}>
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
          <select id="room" onChange={handleChange}>
            <option value="2013A">2013A</option>
            <option value="2001D">2001D</option>
          </select>
        </div>

        <div>
          <label htmlFor="idCourse">Course: </label>
          <select
            id="idCourse"
            onChange={handleChange}
            defaultValue={courses[0]?.uuid}
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
          <select
            id="idProf"
            onChange={handleChange}
            defaultValue={profs[0]?.uuid}
          >
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
