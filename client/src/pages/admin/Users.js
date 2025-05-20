import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";

import Layout from "../Layout.js";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getUsers, deleteUser } from "../../services/UserService.js";
import Loader from "../../components/Loader.js";

const Users = () => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [users, setUsers] = useState([]);
  const axiosCustom = useAxiosCustom();

  const fetchUsers = async () => {
    setLoadingCount((prev) => prev + 1);
    try {
      const usersData = await getUsers(axiosCustom);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingCount((prev) => prev - 1);
    }
  };

  const onDeleteUser = (uuid) => {
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
          await deleteUser(axiosCustom, uuid);
          fetchUsers();
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Failed to delete user", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchUsers();
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
          <div className="flex gap-2">
            <button className="w-24 px-4 py-1.5 bg-sky-100 text-blue-500 rounded-md text-sm font-medium hover:bg-sky-200 transition-all duration-200 hover:-translate-y-0.5">
              <Link
                to={`/admin/users/edit/${row.original.uuid}`}
                className="block w-full h-full"
              >
                Edit
              </Link>
            </button>
            <button
              onClick={() => onDeleteUser(row.original.uuid)}
              className="w-24 px-4 py-1.5 bg-red-100 text-red-500 rounded-md text-sm font-medium hover:bg-red-200 transition-all duration-200 hover:-translate-y-0.5"
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
        <div className="p-4 sm:p-5 h-full flex flex-col overflow-hidden">
          <Loader />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="p-4 sm:p-5 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 py-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            List of Users
          </h1>
          <Link
            to="/admin/users/add"
            className="no-underline bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded shadow hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow transition-all duration-300 flex items-center gap-2 h-10 self-center"
          >
            <span>+</span>
            Add user
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-white rounded-lg">
          {users?.length ? (
            <MaterialReactTable
              columns={columns}
              data={users}
              enablePagination
              enableColumnOrdering
            />
          ) : (
            <p className="text-center py-12 bg-white rounded-xl shadow-lg text-slate-500 text-lg">
              No users to display
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
