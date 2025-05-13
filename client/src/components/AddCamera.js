"use client";

import { useState } from "react";
import style from "../styles/RoomsCameras.module.css";

const mockRooms = [
  { id: 1, name: "Lecture Hall A" },
  { id: 2, name: "Laboratory B12" },
  { id: 3, name: "Seminar Room 101" },
  { id: 4, name: "Auditorium" },
  { id: 5, name: "Computer Lab" },
  { id: 6, name: "Faculty Office" },
  { id: 7, name: "Conference Room" },
  { id: 8, name: "Student Lounge" },
];

const AddCamera = () => {
  const [formData, setFormData] = useState({
    name: "",
    roomId: "",
    isActive: true,
    ipAddress: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(
        `Camera ${formData.name} has been added to ${
          mockRooms.find((room) => room.id.toString() === formData.roomId)?.name
        }`
      );
      setFormData({
        name: "",
        roomId: "",
        isActive: true,
        ipAddress: "",
        description: "",
      });
    } catch (error) {
      alert("There was a problem adding the camera. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.card}>
      <div className={style.cardContent}>
        <form onSubmit={handleSubmit} className={style.formContainer}>
          <div className={style.formGrid}>
            <div className={style.formGroup}>
              <label className={style.formLabel} htmlFor="name">
                Camera Name
              </label>
              <input
                className={style.formInput}
                id="name"
                name="name"
                placeholder="e.g., CAM-001"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.formLabel} htmlFor="room">
                Associated Room
              </label>
              <select
                className={style.formSelect}
                id="room"
                name="roomId"
                value={formData.roomId}
                onChange={handleChange}
                required
              >
                <option value="">Select a room</option>
                {mockRooms.map((room) => (
                  <option key={room.id} value={room.id.toString()}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.formGroup}>
              <label className={style.formLabel} htmlFor="ipAddress">
                IP Address
              </label>
              <input
                className={style.formInput}
                id="ipAddress"
                name="ipAddress"
                placeholder="e.g., 192.168.1.100"
                value={formData.ipAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={style.formActions}>
            <button
              type="submit"
              className={`${style.btn} ${style.btnPrimary}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Camera..." : "Add Camera"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCamera;
