import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const RequireAuth = ({ allowedRoles }) => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();

  // Folosim useEffect pentru a reseta autentificarea
  // în loc să o facem direct în timpul randării
  useEffect(() => {
    if (!auth?.accessToken) {
      setAuth({});
    }
  }, [auth?.accessToken, setAuth]);

  // Redirecționare dacă nu există token
  if (!auth?.accessToken) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificăm dacă rolul utilizatorului este permis
  if (allowedRoles.includes(auth?.role)) {
    return <Outlet />;
  }

  // Dacă utilizatorul este autentificat, dar nu are permisiuni
  return <Navigate to="/unauthorized" state={{ from: location }} replace />;
};

export default RequireAuth;
