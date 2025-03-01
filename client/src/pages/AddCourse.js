import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Layout from "./Layout";
import styles from "../styles/AddCourse.module.css";

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
  const [name, setName] = useState("");
  const [program, setProgram] = useState("Bachelor");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const addCourse = async () => {
    try {
      const response = await axiosCustom.post("/courses", {
        name,
        program,
      });
      if (response?.data) {
        navigate("/courses");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg);
      } else {
        setError("An unexpected error occurred");
      }
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
                value={name}
                placeholder="Course Name"
                onChange={(e) => setName(e.target.value)}
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
                value={program}
                onChange={(e) => setProgram(e.target.value)}
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
