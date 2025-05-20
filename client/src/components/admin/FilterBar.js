import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: "",
    programLevel: "",
  });

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const levels = ["Bachelor", "Master"];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[350px] relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by course name..."
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            className="w-full px-10 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div className="w-full md:w-[200px]">
          <select
            value={filters.programLevel}
            onChange={(e) => handleFilterChange("programLevel", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm appearance-none bg-white"
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
