import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.accessToken) {
      setAuth({});
    }
  }, [auth?.accessToken, setAuth]);

  if (!auth?.accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (allowedRoles.includes(auth?.role)) {
    return <Outlet />;
  }
  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequireAuth;
