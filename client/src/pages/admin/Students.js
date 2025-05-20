import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import dateFormat from "dateformat";

import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getStudents, deleteStudent } from "../../services/StudentService.js";
import Layout from "../Layout.js";
import Loader from "../../components/Loader.js";

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
        Cell: ({ cell }) => dateFormat(cell.getValue(), "dd-mmm-yyyy"),
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
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-green-100 text-green-600 rounded-md text-sm font-medium hover:bg-green-200 transition-all duration-200 hover:-translate-y-0.5">
              <Link
                to={`/admin/students/${row.original.uuid}`}
                className="block w-full h-full"
              >
                View
              </Link>
            </button>
            <button className="px-4 py-1.5 bg-sky-100 text-blue-500 rounded-md text-sm font-medium hover:bg-sky-200 transition-all duration-200 hover:-translate-y-0.5">
              <Link
                to={`/admin/students/edit/${row.original.uuid}`}
                className="block w-full h-full"
              >
                Edit
              </Link>
            </button>
            <button
              className="px-4 py-1.5 bg-red-100 text-red-500 rounded-md text-sm font-medium hover:bg-red-200 transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => onDeleteStudent(row.original.uuid)}
            >
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
      <div className="p-4 sm:p-5 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 py-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Student List
          </h1>
          <Link
            to="/admin/students/add"
            className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded shadow hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow transition-all duration-300 flex items-center gap-2 h-10 self-start mb-4"
          >
            <span>+</span>
            Add student
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-white rounded-lg">
          {students?.length ? (
            <MaterialReactTable
              columns={columns}
              data={students}
              enablePagination
              enableColumnOrdering
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg text-slate-500 text-lg">
              <p>No students to display</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Students;
