export const getActivitesByCourse = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/activities/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

export const createActivity = async (axiosCustom, formData) => {
  try {
    const response = await axiosCustom.post("/activities", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating activity:", error);
    throw error;
  }
};
