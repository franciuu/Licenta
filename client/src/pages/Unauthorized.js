import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import useAuth from "../hooks/useAuth";

const Unauthorized = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleOnClick = () => {
    if (auth.role === "admin") {
      navigate("/admin/users");
    } else if (auth.role === "professor") {
      navigate("/professor/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <FaLock className="w-16 h-16 text-purple-600 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-8">
          You do not have permission to view this page.
        </p>
        <button
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-purple-700"
          onClick={handleOnClick}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
