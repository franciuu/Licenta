import { useState, useEffect, useMemo } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useParams } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Loader from "../../components/Loader";
import { getAttendancesByActivity } from "../../services/AttendanceService";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams();

  useEffect(() => {
    const fetchAttendances = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const attendancesData = await getAttendancesByActivity(axiosCustom, id);
        setAttendances(attendancesData);
      } catch (error) {
        console.error(
          "Error fetching activities:",
          error.response?.data || error.message
        );
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };
    fetchAttendances();
  }, [axiosCustom, id]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableColumnOrdering: false,
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "arrivalTime",
        header: "Arrival Time",
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
      <p>{id}</p>
      {attendances?.length ? (
        <MaterialReactTable
          columns={columns}
          data={attendances}
          enablePagination
          enableColumnOrdering
        />
      ) : (
        <p>No attendances</p>
      )}
    </Layout>
  );
};
export default ViewAttendance;
