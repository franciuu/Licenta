import { Link } from "react-router-dom";
import { generatePatternImage } from "../../utils/GeneratePattern.js";

const CourseCard = ({ info }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-shadow duration-300 border-none h-full flex flex-col hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
      <div className="h-[160px]">
        <img
          src={generatePatternImage()}
          alt="Course pattern"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-[#f8f9fa] p-3 flex-grow flex flex-col">
        <h2 className="text-[1.25rem] font-semibold mb-2 text-[#333]">
          {info.name}
        </h2>
        <h3 className="text-[0.9rem] text-[#a0a0a0] mb-4">
          {info.programLevel}
        </h3>
        <div className="mt-auto self-start">
          <button className="border border-[#7e22ce] rounded-md px-4 py-[0.4rem] transition-all duration-300 hover:bg-[#7e22ce] group">
            <Link
              to={`/admin/courses/${info.uuid}`}
              className="text-[#7e22ce] no-underline font-medium text-[0.9rem] transition-colors duration-300 group-hover:text-white"
            >
              View
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
