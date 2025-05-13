"use client";

import { useState } from "react";
import style from "../styles/RoomsCameras.module.css";

const mockCameras = [
  {
    id: 1,
    name: "CAM-001",
    roomId: 1,
    roomName: "Lecture Hall A",
    status: "active",
  },
  {
    id: 2,
    name: "CAM-002",
    roomId: 1,
    roomName: "Lecture Hall A",
    status: "active",
  },
  {
    id: 3,
    name: "CAM-003",
    roomId: 2,
    roomName: "Laboratory B12",
    status: "active",
  },
  {
    id: 4,
    name: "CAM-004",
    roomId: 3,
    roomName: "Seminar Room 101",
    status: "inactive",
  },
  {
    id: 5,
    name: "CAM-005",
    roomId: 4,
    roomName: "Auditorium",
    status: "active",
  },
  {
    id: 6,
    name: "CAM-006",
    roomId: 4,
    roomName: "Auditorium",
    status: "active",
  },
  {
    id: 7,
    name: "CAM-007",
    roomId: 4,
    roomName: "Auditorium",
    status: "active",
  },
  {
    id: 8,
    name: "CAM-008",
    roomId: 5,
    roomName: "Computer Lab",
    status: "active",
  },
];

const CamerasList = () => {
  const [cameras, setCameras] = useState(mockCameras);

  const handleDelete = (id) => {
    setCameras(cameras.filter((camera) => camera.id !== id));
  };

  return (
    <div className={style.formGrid}>
      {cameras.map((camera) => (
        <div key={camera.id} className={style.card}>
          <div className={style.cardHeader}>
            <div
              className={`${style.flex} ${style.justifyBetween} ${style.itemsCenter}`}
            >
              <h3 className={style.cardTitle}>{camera.name}</h3>
              <span
                className={`${style.badge} ${
                  camera.status === "active"
                    ? style.badgeSuccess
                    : style.badgeError
                }`}
              >
                {camera.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
            <div className={style.cardDescription}>
              Located in: {camera.roomName}
            </div>
          </div>
          <div className={style.cardContent}>
            <span className={camera.status === "active" ? "" : style.textMuted}>
              {camera.status === "active"
                ? "Camera is functioning properly"
                : "Camera needs maintenance"}
            </span>
          </div>
          <div className={style.cardFooter}>
            <button
              className={`${style.btn} ${style.btnOutline} ${style.btnSm}`}
            >
              Edit
            </button>
            <button
              className={`${style.btn} ${style.btnDanger} ${style.btnSm}`}
              onClick={() => handleDelete(camera.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CamerasList;
