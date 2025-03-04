import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../pages/Layout.js";
import useAxiosCustom from "../hooks/useAxiosCustom.js";

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
      const response = await axiosCustom.post("/activities", formData);
      if (response?.data) {
        navigate("/activities");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await axiosCustom.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getProfs = async () => {
      try {
        const response = await axiosCustom.get("/users");
        setProfs(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCourses();
    getProfs();
  }, []);

  const handleChange = (e) => {
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
          <select id="idCourse" onChange={handleChange}>
            {courses.map((c) => (
              <option key={c.uuid} value={c.uuid}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="idProf">Professor: </label>
          <select id="idProf" onChange={handleChange}>
            {profs
              .filter((p) => p.role === "professor")
              .map((p) => (
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
