import { useState, useEffect } from "react";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();

  const getUsers = async () => {
    try {
      const response = await axiosCustom.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      navigate("/", { state: { from: location }, replace: true });
    }
  };

  const deleteUser = async (uuid) => {
    try {
      await axiosCustom.delete(`/users/${uuid}`);
      getUsers();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response?.data || error.message
      );
      navigate("/", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>List of Users</h1>
      {users?.length ? (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.uuid}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/users/edit/${user.uuid}`}>Edit</Link>
                  <button onClick={() => deleteUser(user.uuid)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
};

export default UserList;
