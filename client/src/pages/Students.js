import Layout from "./Layout.js";
import { Link } from "react-router-dom";
import StudentList from "../components/StudentList.js";
const Students = () => {
  return (
    <Layout>
      <Link to="/students/add" className="btn">
        Add new student
      </Link>
      <StudentList />
    </Layout>
  );
};
export default Students;
