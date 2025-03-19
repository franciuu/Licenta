import Layout from "./Layout.js";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable } from "material-react-table";
import Swal from "sweetalert2";
import useAxiosCustom from "../hooks/useAxiosCustom";
import { getUsers, deleteUser } from "../services/UserService.js";
import Loader from "../components/Loader.js";
import style from "../styles/Users.module.css";

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
          console.error("Failed to delete student", error);
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
          <div className={style.actionButtonContainer}>
            <button className={`${style.actionButton} ${style.editButton}`}>
              <Link to={`/admin/users/edit/${row.original.uuid}`}>Edit</Link>
            </button>
            <button
              onClick={() => onDeleteUser(row.original.uuid)}
              className={`${style.actionButton} ${style.deleteButton}`}
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
        <div className={style.usersContainer}>
          <Loader />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className={style.usersContainer}>
        <div className={style.pageHeader}>
          <h1 className={style.pageTitle}>List of Users</h1>
          <Link to="/admin/users/add" className={style.btn}>
            Add new user
          </Link>
        </div>
        {users?.length ? (
          <MaterialReactTable
            columns={columns}
            data={users}
            enablePagination
            enableColumnOrdering
          />
        ) : (
          <p className={style.emptyState}>No users to display</p>
        )}
      </div>
    </Layout>
  );
};

export default Users;
