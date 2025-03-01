import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosCustom from "../hooks/useAxiosCustom";
import Layout from "./Layout";
import UserForm from "../components/UserForm";

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

  const updateUser = async (data) => {
    try {
      await axiosCustom.patch(`/users/${id}`, data);
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.msg || "An unexpected error occurred");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <Layout>
      <h1>Edit User</h1>
      <UserForm
        initialValues={user}
        onSubmit={updateUser}
        error={error}
        isEdit={true}
      />
    </Layout>
  );
};

export default EditUser;
