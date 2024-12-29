import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Users from "./pages/Users.js";
import AddUser from "./pages/AddUser.js";
import EditUser from "./pages/EditUser.js";
import Unauthorized from "./pages/Unauthorized.js";
import "./styles/General.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext.js";
import PrivateRoute from "./components/PrivateRoute.js";
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin", "professor"]}>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/users"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/add"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AddUser />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/users/edit/:id"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <EditUser />
              </PrivateRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
