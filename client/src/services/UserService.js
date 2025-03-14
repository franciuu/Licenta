export const getUsers = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const getProfessors = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/professors");
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const deleteUser = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
