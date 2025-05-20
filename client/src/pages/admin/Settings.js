import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import Layout from "../Layout";
import useAxiosCustom from "../../hooks/useAxiosCustom";
import { getAcademicYears } from "../../services/AcademicYearService";
import { createRoom, getRooms, deleteRoom } from "../../services/RoomService";
import AddRoomForm from "../../components/admin/AddRoomForm";
import RoomsList from "../../components/admin/RoomsList";
import AcademicYearsList from "../../components/admin/AcademicYearsList";

const Settings = () => {
  const [years, setYears] = useState([]);
  const [rooms, setRooms] = useState([]);
  const axiosCustom = useAxiosCustom();

  const fetchYearsData = async () => {
    try {
      const yearsData = await getAcademicYears(axiosCustom);
      setYears(yearsData);
      console.log(yearsData);
    } catch (error) {
      console.error("Failed to fetch academic years data", error);
    }
  };

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

  const handleDeleteRoom = (uuid) => {
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

  const handleDeleteYear = async (uuid) => {
    try {
      // Implement deleteYear service function
      // await deleteYear(axiosCustom, uuid)
      fetchYearsData();
      Swal.fire({
        title: "Deleted!",
        text: "Academic year has been deleted.",
        icon: "success",
      });
    } catch (error) {
      console.error("Failed to delete academic year", error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchYearsData();
  }, []);

  return (
    <Layout>
      <div className="mx-auto my-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Academic Years
            </h2>
            <Link
              to="/admin/academic/add"
              className="bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded shadow hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow transition-all duration-300 flex items-center gap-2 h-10 self-start mb-4"
            >
              <span>+</span>
              <span>Add Academic Year</span>
            </Link>
          </div>
          <AcademicYearsList
            years={years}
            onDeleteYear={handleDeleteYear}
          ></AcademicYearsList>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Rooms</h2>
          </div>
        </div>
        <AddRoomForm onAddRoom={handleAddRoom} />
        <RoomsList rooms={rooms} onDeleteRoom={handleDeleteRoom} />
      </div>
    </Layout>
  );
};
export default Settings;
