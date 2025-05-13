import { FaTrashAlt } from "react-icons/fa";

import style from "../styles/RoomsCameras.module.css";

const RoomsList = ({ rooms, onDeleteRoom }) => {
  return (
    <div className={style.formGrid}>
      {rooms.map((room) => (
        <div key={room.uuid} className={style.card}>
          <div className={style.cardHeader}>
            <h3 className={style.cardTitle}>{room.name}</h3>
            <div className={style.cardDescription}>
              {room.cameraCount} {room.cameraCount === 1 ? "camera" : "cameras"}{" "}
              installed
            </div>
          </div>
          <div className={style.cardContent}>
            <button
              className={`${style.badge} ${
                room.cameraCount > 0 ? style.badgeDefault : style.badgeError
              }`}
              onClick={() => onDeleteRoom(room.uuid)}
            >
              <FaTrashAlt />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
