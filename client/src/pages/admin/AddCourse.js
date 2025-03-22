import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Layout from "../Layout";
import styles from "../../styles/AddCourse.module.css";
import { createCourse } from "../../services/CourseService";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  program: Yup.mixed()
    .oneOf(["Bachelor", "Master"], "Invalid program")
    .required("Program level is required"),
});

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [formData, setFormData] = useState({
    name: "",
    program: "Bachelor",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const addCourse = async () => {
    try {
      const courseData = createCourse(axiosCustom, formData);
      if (courseData) {
        navigate("/admin/courses");
      }
    } catch (error) {
      setError(error.response?.data?.msg);
      console.error("Failed to create activity", error);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Add Course</h1>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit(addCourse)}>
          <div className={styles.inputDiv}>
            <label htmlFor="name">Name:</label>
            <div className={styles.input}>
              <input
                {...register("name")}
                type="text"
                id="name"
                value={formData.name}
                placeholder="Course Name"
                onChange={handleChange}
              />
              <p className={styles.error}>{errors.name?.message}</p>
            </div>
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="program">Program:</label>
            <div className={styles.input}>
              <select
                {...register("program")}
                id="program"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </select>
              <p className={styles.error}>{errors.program?.message}</p>
            </div>
          </div>
          <button type="submit" className={styles.btn}>
            Save
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddCourse;
