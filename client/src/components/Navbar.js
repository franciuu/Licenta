import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <header>
      <nav className="flex justify-end items-center bg-[#f8f5ff] px-6 py-2.5 text-gray-800 h-[60px] shadow-[0_2px_8px_rgba(128,0,128,0.1)] fixed top-0 left-[250px] right-0 z-[90] w-[calc(100%-250px)] border-b border-b-purple-500/20 md:px-6 md:py-2.5 md:left-[250px] md:w-[calc(100%-250px)]">
        {auth.role === "admin" && (
          <button
            onClick={() => navigate("/admin/generate")}
            className="outline-none cursor-pointer text-[13px] rounded-lg transition-all duration-300 border border-transparent tracking-[1.5px] min-w-[120px] font-semibold text-center py-2.5 px-3.5 text-white bg-[#e79316] h-[42px] flex items-center justify-center shadow-[0_2px_5px_rgba(231,147,22,0.3)] ml-[15px] hover:bg-[#f8bb03] hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(231,147,22,0.4)] active:translate-y-0 active:shadow-[0_2px_5px_rgba(231,147,22,0.3)] active:bg-[#d88a15]"
          >
            Update
          </button>
        )}
        <button
          onClick={handleLogout}
          className="outline-none cursor-pointer text-[13px] rounded-lg transition-all duration-300 border border-transparent tracking-[1.5px] min-w-[120px] font-semibold text-center py-2.5 px-3.5 text-white bg-[#e79316] h-[42px] flex items-center justify-center shadow-[0_2px_5px_rgba(231,147,22,0.3)] ml-[15px] hover:bg-[#f8bb03] hover:-translate-y-[1px] hover:shadow-[0_4px_8px_rgba(231,147,22,0.4)] active:translate-y-0 active:shadow-[0_2px_5px_rgba(231,147,22,0.3)] active:bg-[#d88a15]"
        >
          Log out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
