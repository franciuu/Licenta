"use client";

import { useState } from "react";
import style from "../styles/RoomsCameras.module.css";

const mockRooms = [
  { id: 1, name: "Lecture Hall A", cameraCount: 2 },
  { id: 2, name: "Laboratory B12", cameraCount: 1 },
  { id: 3, name: "Seminar Room 101", cameraCount: 1 },
  { id: 4, name: "Auditorium", cameraCount: 3 },
  { id: 5, name: "Computer Lab", cameraCount: 2 },
  { id: 6, name: "Faculty Office", cameraCount: 1 },
  { id: 7, name: "Conference Room", cameraCount: 1 },
  { id: 8, name: "Student Lounge", cameraCount: 1 },
];

const RoomsList = () => {
  const [rooms] = useState(mockRooms);

  return (
    <div className={style.formGrid}>
      {rooms.map((room) => (
        <div key={room.id} className={style.card}>
          <div className={style.cardHeader}>
            <h3 className={style.cardTitle}>{room.name}</h3>
            <div className={style.cardDescription}>
              {room.cameraCount} {room.cameraCount === 1 ? "camera" : "cameras"}{" "}
              installed
            </div>
          </div>
          <div className={style.cardContent}>
            <span
              className={`${style.badge} ${
                room.cameraCount > 0 ? style.badgeDefault : style.badgeError
              }`}
            >
              {room.cameraCount > 0 ? "Monitored" : "Not Monitored"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
