import { useState, useEffect } from "react";
import React from "react";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useNavigate, useLocation } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();

  const getStudents = async () => {
    try {
      const response = await axiosCustom.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(
        "Error fetching students:",
        error.response?.data || error.message
      );
      navigate("/", { state: { from: location }, replace: true });
    }
  };
  useEffect(() => {
    getStudents();
  }, []);
  return (
    <div>
      <h1>Student List</h1>
      {students?.length ? (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Email</th>
              <th>Study Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stud, index) => (
              <tr key={stud.uuid}>
                <td>{index + 1}</td>
                <td>{stud.name}</td>
                <td>{stud.birthDate}</td>
                <td>{stud.email}</td>
                <td>{stud.studyYear}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students to display</p>
      )}
    </div>
  );
};

export default StudentList;
