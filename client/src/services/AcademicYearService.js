export const getAcademicYears = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/academic-years");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSemesters = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/semesters");
    return response.data;
  } catch (error) {
    throw error;
  }
};
