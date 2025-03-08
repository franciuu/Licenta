import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import dateFormat from "dateformat";
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableColumnOrdering: false,
      },
      {
        accessorKey: "birthDate",
        header: "Birth Date",
        Cell: ({ cell }) => dateFormat(cell.birthDate, "dd-mmm-yyyy"),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "studyYear",
        header: "Study Year",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div>
            <button>
              <Link to={`/students/${row.original.uuid}`}>View</Link>
            </button>
            <button>
              <Link to={`/students/edit/${row.original.uuid}`}>Edit</Link>
            </button>
            <button onClick={() => deleteUser(row.original.uuid)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <div>
      <h1>Student List</h1>
      {students?.length ? (
        <MaterialReactTable
          columns={columns}
          data={students}
          enablePagination
          enableColumnOrdering
        />
      ) : (
        <p>No students to display</p>
      )}
    </div>
  );
};

export default StudentList;
