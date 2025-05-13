import Room from "../models/Room.js";
import { validateRoomInput } from "../validators/RoomValidator.js";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    const validationError = await validateRoomInput({ name });
    if (validationError) {
      return res
        .status(validationError.code)
        .json({ msg: validationError.message });
    }

    await Room.create({
      name,
    });
    res.status(201).json({ msg: "Sucessful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const response = await Room.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOne({
      where: { uuid: req.params.id },
    });
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }
    await room.destroy();
    res.status(200).json({ msg: "Room deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
