import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "../../styles/EditUser.module.css";

const editUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  role: Yup.mixed()
    .oneOf(["admin", "professor"], "Invalid role")
    .required("Role is required"),
});

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosCustom.get(`/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Error fetching user data");
      }
    };

    fetchUser();
  }, [id, axiosCustom]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(editUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const updateUser = async (data) => {
    try {
      await axiosCustom.patch(`/users/${id}`, data);
      navigate("/admin/users");
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
    }
  };

  const handleBack = () => {
    navigate("/admin/users");
  };

  if (!user)
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loader}>Loading user data...</div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.container}>
        <button onClick={handleBack} className={styles.backButton}>
          ← Back to Users
        </button>
        <h1 className={styles.title}>Edit User</h1>
        <form onSubmit={handleSubmit(updateUser)}>
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
                    placeholder="e.g. John Doe"
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
                    placeholder="e.g. johndoe@gmail.com"
                  />
                </div>
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className={styles.formColumn}>
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
          </div>

          <button type="submit" className={styles.btn}>
            Save Changes
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;
