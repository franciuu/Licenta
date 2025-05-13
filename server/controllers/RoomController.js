import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    await Room.create({
      name,
    });
    res.status(201).json({ msg: "Sucessful" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
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
