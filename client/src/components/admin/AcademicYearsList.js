import { FaGraduationCap, FaTrashCan, FaCalendar } from "react-icons/fa6";
import Swal from "sweetalert2";

const AcademicYearsList = ({ years, onDeleteYear }) => {
  const handleDeleteYear = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteYear(uuid);
      }
    });
  };

  if (!years?.length) {
    return (
      <div className="bg-white/50 backdrop-blur-xl rounded-lg p-4 text-center border-2 border-white/60 shadow-sm">
        <p className="text-gray-600 italic">
          No academic years have been registered yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {years.map((year) => (
        <div
          key={year.uuid}
          className="bg-white/50 backdrop-blur-xl rounded-lg border-2 border-white/60 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="text-purple-600 text-lg" />
              <h3 className="font-medium text-gray-800">{year.name}</h3>
            </div>
          </div>

          <div className="p-4 flex-grow">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendar className="text-purple-500/70" />
                <span>Start: {year.startDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendar className="text-purple-500/70" />
                <span>End: {year.endDate}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50/70 border-t border-gray-100 flex justify-between items-center">
            <button className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
              Details
            </button>
            <div className="flex gap-2">
              <button
                className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => handleDeleteYear(year.uuid)}
              >
                <FaTrashCan className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AcademicYearsList;
