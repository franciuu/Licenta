import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password")],
    "Passwords must match"
  ),
  role: Yup.mixed()
  .oneOf(["admin", "professor"], "Invalid role") 
  .required("Role is required"),
});

const AddUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users", {
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (response.data) {
        navigate("/users");
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
      <h1>Add user</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit(addUser)}>
        <div className="inputDiv">
          <label htmlFor="name">Name: </label>
          <div className="input">
            <input
              {...register("name")}
              type="text"
              id="name"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p>{errors.email?.message}</p>
        </div>
        <div className="inputDiv">
          <label htmlFor="password">Password: </label>
          <div className="input">
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p>{errors.password?.message}</p>
        </div>
        <div className="inputDiv">
          <label htmlFor="confirmPassword">Confirm password: </label>
          <div className="input">
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <p>{errors.confirmPassword?.message}</p>
        </div>
        <div className="inputDiv">
          <label htmlFor="role">Role: </label>
          <div className="input">
            <select
              {...register("role")}
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
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

export default AddUser;
