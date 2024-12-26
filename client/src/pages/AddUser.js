import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./Layout";

const AddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addUser = async (e) => {
    e.preventDefault();
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
      <form onSubmit={addUser}>
        <div className="inputDiv">
          <label htmlFor="name">Name: </label>
          <div className="input">
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="email">Email: </label>
          <div className="input">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="password">Password: </label>
          <div className="input">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="confirmPassword">Confirm password: </label>
          <div className="input">
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="role">Role: </label>
          <div className="input">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="professor">Professor</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default AddUser;
