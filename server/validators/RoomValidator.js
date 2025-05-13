import Room from "../models/Room.js";

export async function validateRoomInput({ name }) {
  if (!name) {
    return {
      code: 400,
      message: "The name of the room is mandatory.",
    };
  }

  const existing = await Room.findOne({ where: { name } });
  if (existing) {
    return {
      code: 400,
      message: "There is already a room with this name.",
    };
  }
  return null;
}
