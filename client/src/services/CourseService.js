export const getCourses = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/courses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCourseById = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCourse = async (axiosCustom, formData) => {
  try {
    const response = await axiosCustom.post("/courses", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
