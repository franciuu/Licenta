import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Swal from "sweetalert2";
import useAxiosCustom from "../hooks/useAxiosCustom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const axiosCustom = useAxiosCustom();
  const navigate = useNavigate();
  const location = useLocation();

  const getUsers = async () => {
    try {
      const response = await axiosCustom.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
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
          await axiosCustom.delete(`/users/${uuid}`);
          getUsers();
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error(
            "Error deleting user:",
            error.response?.data || error.message
          );
          navigate("/", { state: { from: location }, replace: true });
        }
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "name", header: "Name", enableColumnOrdering: false },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <div>
            <button>
              <Link to={`/users/edit/${row.original.uuid}`}>Edit</Link>
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
      <h1>List of Users</h1>
      {users?.length ? (
        <MaterialReactTable
          columns={columns}
          data={users}
          enablePagination
          enableColumnOrdering
        />
      ) : (
        <p>No users to display</p>
      )}
    </div>
  );
};

export default UserList;
