import { useEffect, useState, useMemo } from "react";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getPersonalStudents } from "../../services/StudentService";
import Layout from "../Layout";
import styles from "../../styles/Students.module.css";
import { MaterialReactTable } from "material-react-table";
import dateFormat from "dateformat";
import Loader from "../../components/Loader.js";

const PersonalStudents = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [students, setStudents] = useState([]);
  const axiosCustom = useAxiosCustom();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const studentsData = await getPersonalStudents(axiosCustom);
        setStudents(studentsData);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };

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
export default PersonalStudents;
