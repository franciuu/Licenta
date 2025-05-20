import { Icon } from "@chakra-ui/react";
import { FaTasks, FaUserGraduate } from "react-icons/fa";

const StatsSection = ({ studCount, activCount, auth, className }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col ${className}`}
    >
      <div className="px-3 pt-3 pb-1">
        <h1 className="text-lg font-semibold text-gray-800">
          {`Hello, ${auth.name}!`}
        </h1>
        <div className="text-sm font-medium text-gray-500">
          Statistics Overview
        </div>
      </div>

      <div className="px-3 pb-3 flex-1 flex flex-col justify-center gap-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg p-3 text-white">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium opacity-80">
              Total Activities
            </span>
            <Icon as={FaTasks} className="text-sm opacity-80" />
          </div>
          <div className="text-xl font-bold">{activCount}</div>
        </div>

        <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-3 text-purple-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium opacity-80">
              Total Students
            </span>
            <Icon as={FaUserGraduate} className="text-sm opacity-80" />
          </div>
          <div className="text-xl font-bold">{studCount}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
