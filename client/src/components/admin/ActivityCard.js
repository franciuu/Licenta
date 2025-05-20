import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { generatePatternImage } from "../../utils/GeneratePattern.js";
import useAxiosCustom from "../../hooks/useAxiosCustom.js";
import { deleteActivity } from "../../services/ActivityService.js";

const ActivityCard = ({ info, onDeleted }) => {
  const axiosCustom = useAxiosCustom();

  const onDelete = (uuid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteActivity(axiosCustom, uuid);
          Swal.fire({
            title: "Deleted!",
            text: "Activity has been deleted.",
            icon: "success",
          });
          if (onDeleted) {
            onDeleted();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.05)] transition-shadow duration-300 border-none h-full flex flex-col hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
      <div className="relative h-[160px]">
        <img
          src={generatePatternImage()}
          alt="Activity pattern"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h2 className="absolute bottom-3 left-4 text-white text-[1.25rem] font-semibold">
          {info.name}
        </h2>
      </div>
      <div className="bg-[#f8f9fa] p-4 flex gap-2">
        <button className="border border-[#7e22ce] rounded-md px-4 py-[0.4rem] transition-all duration-300 hover:bg-[#7e22ce] group flex-1">
          <Link
            to={`/admin/activities/${info.uuid}`}
            className="text-[#7e22ce] no-underline font-medium text-[0.9rem] transition-colors duration-300 group-hover:text-white block text-center"
          >
            View
          </Link>
        </button>
        <button
          className="border border-red-500 rounded-md px-4 py-[0.4rem] transition-all duration-300 hover:bg-red-500 group flex-1"
          onClick={() => onDelete(info.uuid)}
        >
          <span className="text-red-500 no-underline font-medium text-[0.9rem] transition-colors duration-300 group-hover:text-white block text-center">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
