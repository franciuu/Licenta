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

export const getPersonalActivities = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/activities/personal");
    return response.data.activities;
  } catch (error) {
    throw error;
  }
};

export const getActivitiesCount = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get("/activities/personal");
    return response.data.count;
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
