export const getAcademicYears = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/academic-years");
    return response.data;
  } catch (error) {
    throw error;
  }
};
