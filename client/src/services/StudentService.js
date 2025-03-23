export const getStudents = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get(`/students`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPersonalStudents = async (axiosCustom) => {
  try {
    const response = await axiosCustom.get(`/personal/students`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentById = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentByEmail = async (axiosCustom, email) => {
  try {
    const response = await axiosCustom.get(`/students/search?email=${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createStudent = async (axiosCustom, formData, imageUrls) => {
  try {
    const response = await axiosCustom.post("/students", {
      ...formData,
      images: imageUrls,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudent = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
