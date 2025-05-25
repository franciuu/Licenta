import { FaClock } from "react-icons/fa";

const TimeStatus = ({ timeStatus }) => {
  return (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
        timeStatus
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      <FaClock className="w-4 h-4 mr-2" />
      {timeStatus
        ? "This activity is currently in progress"
        : "You are outside the scheduled time for this activity"}
    </div>
  );
};
export default TimeStatus;
