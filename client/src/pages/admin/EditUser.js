import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import Layout from "../Layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

  if (!user) return <p>Loading...</p>;

  return (
    <Layout>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit(updateUser)}>
        {error && <p className="error">{error}</p>}

        <div className="inputDiv">
          <label htmlFor="name">Name: </label>
          <div className="input">
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Name"
            />
          </div>
          <p>{errors.name?.message}</p>
        </div>

        <div className="inputDiv">
          <label htmlFor="email">Email: </label>
          <div className="input">
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Email"
            />
          </div>
          <p>{errors.email?.message}</p>
        </div>

        <div className="inputDiv">
          <label htmlFor="role">Role: </label>
          <div className="input">
            <select {...register("role")} id="role">
              <option value="admin">Admin</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          <p>{errors.role?.message}</p>
        </div>

        <button type="submit" className="btn">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default EditUser;
