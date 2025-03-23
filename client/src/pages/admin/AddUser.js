import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../styles/AddUser.module.css";

const addUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.mixed()
    .oneOf(["admin", "professor"], "Invalid role")
    .required("Role is required"),
});

const AddUser = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUserSchema),
  });

  const addUser = async (data) => {
    try {
      const response = await axiosCustom.post("/users", data);
      if (response?.data) {
        navigate("/admin/users");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Add User</h1>
        <form onSubmit={handleSubmit(addUser)}>
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <div className={styles.inputDiv}>
                <label htmlFor="name">Name: </label>
                <div className={styles.input}>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    placeholder="Name"
                  />
                </div>
                {errors.name && (
                  <p className={styles.error}>{errors.name.message}</p>
                )}
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="email">Email: </label>
                <div className={styles.input}>
                  <input
                    {...register("email")}
                    type="email"
                    id="email"
                    placeholder="Email"
                  />
                </div>
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="role">Role: </label>
                <div className={styles.input}>
                  <select {...register("role")} id="role">
                    <option value="admin">Admin</option>
                    <option value="professor">Professor</option>
                  </select>
                </div>
                {errors.role && (
                  <p className={styles.error}>{errors.role.message}</p>
                )}
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.inputDiv}>
                <label htmlFor="password">Password: </label>
                <div className={styles.input}>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    placeholder="Password"
                  />
                </div>
                {errors.password && (
                  <p className={styles.error}>{errors.password.message}</p>
                )}
              </div>

              <div className={styles.inputDiv}>
                <label htmlFor="confirmPassword">Confirm password: </label>
                <div className={styles.input}>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className={styles.error}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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

export default AddUser;
