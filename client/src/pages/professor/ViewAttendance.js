import { useState, useEffect, useMemo } from "react";
import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { useParams } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Loader from "../../components/Loader";

const ViewAttendance = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams();

  useEffect(() => {
    const getAttendances = async () => {
      setLoadingCount((prev) => prev + 1);
      try {
        const response = await axiosCustom.get(`/attendances/${id}`);
        setAttendances(response.data);
      } catch (error) {
        console.error(
          "Error fetching activities:",
          error.response?.data || error.message
        );
      } finally {
        setLoadingCount((prev) => prev - 1);
      }
    };
    getAttendances();
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
