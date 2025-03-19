import { useState, useEffect, useMemo } from "react";
import Layout from "./Layout";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { useParams } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";

const ViewAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const axiosCustom = useAxiosCustom();
  const { id } = useParams();

  useEffect(() => {
    const getAttendances = async () => {
      try {
        const response = await axiosCustom.get(`/attendances/${id}`);
        setAttendances(response.data);
      } catch (error) {
        console.error(
          "Error fetching activities:",
          error.response?.data || error.message
        );
      }
    };
    getAttendances();
  }, [axiosCustom, id]);

  // const attendances = [
  //   { name: "Mirel", date: "12-12-2003", arrivalTime: "10:22:41" },
  // ];

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
