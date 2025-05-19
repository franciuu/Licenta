import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Page404 = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleOnClick = () => {
    if (auth.role === "admin") {
      navigate("/admin/users");
    } else if (auth.role === "professor") {
      navigate("/professor/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-6 sm:p-8 text-center">
        <div className="mb-6">
          <div className="text-9xl font-bold text-purple-600 mb-2">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Pagină negăsită
          </h1>
          <p className="text-gray-600 mb-6">
            Ne pare rău, dar pagina pe care o căutați nu există.
          </p>
        </div>

        <button
          onClick={handleOnClick}
          className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:bg-purple-700"
        >
          Mergi la pagina principală
        </button>
      </div>
    </div>
  );
};

export default Page404;
