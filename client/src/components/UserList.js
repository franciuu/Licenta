import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Importă contextul de autentificare

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { auth } = useAuth(); // Obține token-ul din context

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Trimite token-ul
        },
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  const deleteUser = async (uuid) => {
    try {
      await axios.delete(`http://localhost:5000/users/${uuid}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Trimite token-ul la ștergere
        },
        withCredentials: true,
      });
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>List of Users</h1>
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
    </div>
  );
};

export default UserList;
