import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Users from "./pages/Users.js";
import AddUser from "./pages/AddUser.js";
import EditUser from "./pages/EditUser.js";
import Unauthorized from "./pages/Unauthorized.js";
import Students from "./pages/Students.js";
import RequireAuth from "./components/RequireAuth.js";
import "./styles/General.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={["admin", "professor"]} />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/students" element={<Students />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/users" element={<Users />} />
          <Route path="/users/add" element={<AddUser />}></Route>
          <Route path="/users/edit/:id" element={<EditUser />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
