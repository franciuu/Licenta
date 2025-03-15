export const createEnrollment = async (axiosCustom, idStudent, idActivity) => {
  try {
    const response = await axiosCustom.post("/enrollments", {
      idStudent,
      idActivity,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActivityEnrollments = async (axiosCustom, idActivity) => {
  try {
    const response = await axiosCustom.get(`/enrollments/${idActivity}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
