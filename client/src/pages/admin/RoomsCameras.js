import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import useAxiosCustom from "../../hooks/useAxiosCustom";
import RoomsList from "../../components/RoomsList";
import CamerasList from "../../components/CamerasList";
import AddCameraForm from "../../components/AddCamera";
import Layout from "../Layout";
import style from "../../styles/RoomsCameras.module.css";
import AddRoomForm from "../../components/AddRoomForm";
import { createRoom, getRooms, deleteRoom } from "../../services/RoomService";

const RoomsCameras = () => {
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const axiosCustom = useAxiosCustom();

  const fetchRooms = async () => {
    try {
      const roomsData = await getRooms(axiosCustom);
      setRooms(roomsData);
    } catch (error) {
      console.error("Failed to fetch rooms data", error);
    }
  };

  const handleAddRoom = async (name) => {
    try {
      await createRoom(axiosCustom, name);
      await fetchRooms();
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const onDeleteRoom = (uuid) => {
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
          await deleteRoom(axiosCustom, uuid);
          fetchRooms();
          Swal.fire({
            title: "Deleted!",
            text: "Room has been deleted.",
            icon: "success",
          });
        } catch (error) {
          console.error("Failed to delete room", error);
        }
      }
    });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Layout>
      <div className={style.container}>
        <h1 className={style.mb6}>Faculty Surveillance Management</h1>

        <div
          className={`${style.flex} ${style.flexWrap} ${style.gap2} ${style.mb6}`}
        >
          <button
            className={`${style.navButton} ${
              activeTab === "rooms" ? style.active : ""
            }`}
            onClick={() => setActiveTab("rooms")}
          >
            Rooms
          </button>
          <button
            className={`${style.navButton} ${
              activeTab === "cameras" ? style.active : ""
            }`}
            onClick={() => setActiveTab("cameras")}
          >
            Cameras
          </button>
          <button
            className={`${style.navButton} ${
              activeTab === "add" ? style.active : ""
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Camera
          </button>
        </div>

        <div
          className={`${style.tabContent} ${
            activeTab === "rooms" ? style.active : ""
          }`}
        >
          <div
            className={`${style.flex} ${style.mb4} ${style.itemsCenter} ${style.justifyBetween}`}
          >
            <h2 className={style.text2xl}>Faculty Rooms</h2>
          </div>
          <AddRoomForm onAddRoom={handleAddRoom} />
          <RoomsList rooms={rooms} onDeleteRoom={onDeleteRoom} />
        </div>

        <div
          className={`${style.tabContent} ${
            activeTab === "cameras" ? style.active : ""
          }`}
        >
          <div
            className={`${style.flex} ${style.mb4} ${style.itemsCenter} ${style.justifyBetween}`}
          >
            <h2 className={style.text2xl}>Surveillance Cameras</h2>
          </div>
          <CamerasList />
        </div>

        <div
          className={`${style.tabContent} ${
            activeTab === "add" ? style.active : ""
          }`}
        >
          <div className={style.mb4}>
            <h2 className={style.text2xl}>Add New Camera</h2>
            <p className={style.textMuted}>
              Register a new surveillance camera and associate it with a room
            </p>
          </div>
          <AddCameraForm />
        </div>
      </div>
    </Layout>
  );
};

export default RoomsCameras;
