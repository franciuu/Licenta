import Layout from "./Layout.js";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import dateFormat from "dateformat";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { getStudents, deleteStudent } from "../services/StudentService.js";
import Loader from "../components/Loader.js";

const Students = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [students, setStudents] = useState([]);
  const axiosCustom = useAxiosCustom();

  const fetchStudents = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const studentsData = await getStudents(axiosCustom);
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const onDeleteStudent = (uuid) => {
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
          await deleteStudent(axiosCustom, uuid);
          fetchStudents();
          Swal.fire({
            title: "Deleted!",
            text: "Student has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Failed to delete student", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchStudents();
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
              <Link to={`/admin/students/edit/${row.original.uuid}`}>Edit</Link>
            </button>
            <button onClick={() => onDeleteStudent(row.original.uuid)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (loadingCount > 0)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  return (
    <Layout>
      <Link to="/admin/students/add" className="btn">
        Add new student
      </Link>
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
    </Layout>
  );
};
export default Students;
