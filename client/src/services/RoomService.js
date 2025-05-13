export const getRooms = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/rooms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createRoom = async (axiosCustom, name) => {
  try {
    const response = await axiosCustom.post("/rooms", { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.delete(`/rooms/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
