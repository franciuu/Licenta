import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import dateFormat from "dateformat";

import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { getStudents, deleteStudent } from "../../services/StudentService.js";
import Layout from "../Layout.js";
import Loader from "../../components/Loader.js";
import styles from "../../styles/Students.module.css";

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
          <div className={styles.actionButtonContainer}>
            <button className={`${styles.actionButton} ${styles.viewButton}`}>
              <Link to={`/admin/students/${row.original.uuid}`}>View</Link>
            </button>
            <button className={`${styles.actionButton} ${styles.editButton}`}>
              <Link to={`/admin/students/edit/${row.original.uuid}`}>Edit</Link>
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
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
      <div className={styles.studentsContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Student List</h1>
          <Link to="/admin/students/add" className={styles.btn}>
            <span className={styles.addIcon}>+</span>
            Add student
          </Link>
        </div>
        <div className={styles.tableContainer}>
          {students?.length ? (
            <MaterialReactTable
              columns={columns}
              data={students}
              enablePagination
              enableColumnOrdering
            />
          ) : (
            <div className={styles.emptyState}>
              <p>No students to display</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export default Students;
