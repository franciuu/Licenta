import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import UserForm from "../components/UserForm.js";

const AddUser = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const axiosCustom = useAxiosCustom();

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
      <h1>Add user</h1>
      <UserForm onSubmit={addUser} error={error} />
    </Layout>
  );
};
export default AddUser;
