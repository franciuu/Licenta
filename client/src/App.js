import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Users from "./pages/Users.js";
import AddUser from "./pages/AddUser.js";
import EditUser from "./pages/EditUser.js";
import Unauthorized from "./pages/Unauthorized.js";
import Students from "./pages/Students.js";
import AddStudent from "./pages/AddStudent.js";
import ViewStudent from "./pages/ViewStudent.js";
import Courses from "./pages/Courses.js";
import AddCourse from "./pages/AddCourse.js";
import ViewActivity from "./pages/ViewActivity.js";
import EditStudent from "./pages/EditStudent.js";
import AddActivity from "./pages/AddActivity.js";
import PersonalCalendar from "./pages/PersonalCalendar.js";
import ViewCourse from "./pages/ViewCourse.js";
import ViewAttendance from "./pages/ViewAttendance.js";
import NotFound from "./pages/NotFound.js";

import RequireAuth from "./components/RequireAuth.js";
import PersistLogin from "./components/PersistLogin.js";

import "./styles/General.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={["admin", "professor"]} />}
          >
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/students" element={<Students />}></Route>
            <Route path="/students/:id" element={<ViewStudent />}></Route>
            <Route path="/activities/:id" element={<ViewActivity />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["professor"]} />}>
            <Route path="/calendar" element={<PersonalCalendar />}></Route>
            <Route path="/attendance/:id" element={<ViewAttendance />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddUser />}></Route>
            <Route path="/users/edit/:id" element={<EditUser />}></Route>
            <Route path="/students/add" element={<AddStudent />}></Route>
            <Route path="/students/edit/:id" element={<EditStudent />}></Route>
            <Route path="/courses" element={<Courses />}></Route>
            <Route path="/courses/add" element={<AddCourse />}></Route>
            <Route path="/courses/:id" element={<ViewCourse />}></Route>
            <Route path="/activities/add" element={<AddActivity />}></Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
