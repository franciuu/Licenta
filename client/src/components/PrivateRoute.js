import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  // const { user, isLoading } = useUser();
  // if (isLoading) {
  //   return (
  //     <div className="loader-container">
  //       <div className="loader"></div>
  //     </div>
  //   );
  // }
  // if (!user) {
  //   return <Navigate to="/" />;
  // }
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   console.log("Role:", user);
  //   return <Navigate to="/unauthorized" />;
  // }
  // return children;
};

export default PrivateRoute;
