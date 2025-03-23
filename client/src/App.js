import Login from "./pages/Login.js";
import Unauthorized from "./pages/Unauthorized.js";
import NotFound from "./pages/NotFound.js";
import Page404 from "./pages/404.js";

import Users from "./pages/admin/Users.js";
import AddUser from "./pages/admin/AddUser.js";
import EditUser from "./pages/admin/EditUser.js";
import Courses from "./pages/admin/Courses.js";
import AddCourse from "./pages/admin/AddCourse.js";
import EditStudent from "./pages/admin/EditStudent.js";
import AddActivity from "./pages/admin/AddActivity.js";
import ViewCourse from "./pages/admin/ViewCourse.js";
import ActivityEnrollment from "./pages/admin/ActivityEnrollment.js";
import GenerateEmbeddings from "./pages/admin/GenerateEmbeddings.js";
import AcademicYears from "./pages/admin/AcademicYears.js";
import AddAcademicYear from "./pages/admin/AddAcademicYear.js";
import ViewStudent from "./pages/admin/ViewStudent.js";
import Students from "./pages/admin/Students.js";
import AddStudent from "./pages/admin/AddStudent.js";

import Dashboard from "./pages/professor/Dashboard.js";
import TakeAttendance from "./pages/professor/TakeAttendance.js";
import PersonalCalendar from "./pages/professor/PersonalCalendar.js";
import ViewAttendance from "./pages/professor/ViewAttendance.js";
import PersonalStudents from "./pages/professor/PersonalStudents.js";

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
            <Route path="/404" element={<Page404 />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["professor"]} />}>
            <Route path="/professor/dashboard" element={<Dashboard />}></Route>
            <Route
              path="/professor/activities/:id"
              element={<ViewAttendance />}
              key={window.location.pathname}
            ></Route>
            <Route
              path="/professor/calendar"
              element={<PersonalCalendar />}
            ></Route>
            <Route
              path="/professor/attendance/:id"
              element={<TakeAttendance />}
            ></Route>
            <Route
              path="/professor/students"
              element={<PersonalStudents />}
            ></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/admin/academic" element={<AcademicYears />}></Route>
            <Route
              path="/admin/academic/add"
              element={<AddAcademicYear />}
            ></Route>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/add" element={<AddUser />}></Route>
            <Route path="/admin/users/edit/:id" element={<EditUser />}></Route>
            <Route path="/admin/students/add" element={<AddStudent />}></Route>
            <Route path="/admin/students" element={<Students />}></Route>
            <Route path="/admin/students/:id" element={<ViewStudent />}></Route>
            <Route
              path="/admin/students/edit/:id"
              element={<EditStudent />}
            ></Route>
            <Route path="/admin/courses" element={<Courses />}></Route>
            <Route path="/admin/courses/add" element={<AddCourse />}></Route>
            <Route path="/admin/courses/:id" element={<ViewCourse />}></Route>
            <Route
              path="/admin/activities/add"
              element={<AddActivity />}
            ></Route>
            <Route
              path="/admin/activities/:id"
              element={<ActivityEnrollment />}
            ></Route>
            <Route
              path="/admin/generate"
              element={<GenerateEmbeddings />}
            ></Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
