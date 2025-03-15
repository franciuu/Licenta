export const getActivitesByCourse = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/activities/course/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActivityById = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/activities/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createActivity = async (axiosCustom, formData) => {
  try {
    const response = await axiosCustom.post("/activities", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
