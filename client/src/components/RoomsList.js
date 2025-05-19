"use client";

import { FaTrashAlt } from "react-icons/fa";

const RoomsList = ({ rooms, onDeleteRoom }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {rooms.map((room) => (
        <div
          key={room.uuid}
          className="bg-white rounded-md shadow-sm border border-gray-100 flex items-center justify-between p-2 hover:shadow-md transition-shadow"
        >
          <h3 className="text-sm font-medium text-gray-700 truncate">
            {room.name}
          </h3>
          <button
            className="ml-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
            onClick={() => onDeleteRoom(room.uuid)}
            aria-label={`Delete ${room.name}`}
          >
            <FaTrashAlt className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
