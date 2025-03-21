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
import TakeAttendance from "./pages/TakeAttendance.js";
import EditStudent from "./pages/EditStudent.js";
import AddActivity from "./pages/AddActivity.js";
import PersonalCalendar from "./pages/PersonalCalendar.js";
import ViewCourse from "./pages/ViewCourse.js";
import ViewAttendance from "./pages/ViewAttendance.js";
import NotFound from "./pages/NotFound.js";
import Page404 from "./pages/404.js";
import ActivityEnrollment from "./pages/ActivityEnrollment.js";
import GenerateEmbeddings from "./pages/GenerateEmbeddings.js";
import AcademicYears from "./pages/AcademicYears.js";

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

            <Route path="/404" element={<Page404 />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["professor"]} />}>
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
          </Route>

          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/admin/academic" element={<AcademicYears />}></Route>
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/add" element={<AddUser />}></Route>
            <Route path="/admin/users/edit/:id" element={<EditUser />}></Route>
            <Route path="/admin/students/add" element={<AddStudent />}></Route>
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
