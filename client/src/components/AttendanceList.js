import { useState, useEffect, useMemo } from "react";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { MaterialReactTable } from "material-react-table";

const AttendanceList = () => {
  //   const [attendances, setAttendance] = useState([]);
  const axiosCustom = useAxiosCustom();

  const attendances = [
    { name: "Mirel", date: "12-12-2003", arrivalTime: "10:22:41" },
  ];

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
    <div>
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
    </div>
  );
};

export default AttendanceList;
