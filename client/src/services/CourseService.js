export const getCourses = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/courses");
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const getCourseById = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};
