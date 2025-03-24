export const getAttendancesByActivity = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/attendances/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
