import Layout from "./Layout.js";
import { Link } from "react-router-dom";
import UserList from "../components/UserList";
const Users = () => {
  return (
    <Layout>
      <Link to="/users/add" className="btn">Add new user</Link>
      <UserList />
    </Layout>
  );
};

export default Users;
