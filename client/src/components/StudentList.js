import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosCustom from "../hooks/useAxiosCustom";

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

  const deleteUser = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosCustom.delete(`/students/${uuid}`);
          getStudents();
          Swal.fire({
            title: "Deleted!",
            text: "Student has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error(
            "Error deleting student:",
            error.response?.data || error.message
          );
          navigate("/", { state: { from: location }, replace: true });
        }
      }
    });
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
              <th>Action</th>
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
                  <button>
                    <Link to={`/students/${stud.uuid}`}>View</Link>
                  </button>
                  <button>Edit</button>
                  <button onClick={() => deleteUser(stud.uuid)}>Delete</button>
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
