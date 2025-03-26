export const getAttendancesByActivityAndDate = async (
  axiosCustom,
  id,
  selectedDate
) => {
  try {
    const response = await axiosCustom.get(
      `/attendances/activity/${id}?date=${selectedDate}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendanceTrendForActivity = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/attendances/trend/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendancePercentageForLecture = async (axiosCustom, id) => {
  try {
    const response = await axiosCustom.get(`/attendances/course/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSeminarAttendancePercentageForCourse = async (
  axiosCustom,
  id
) => {
  try {
    const response = await axiosCustom.get(`/attendances/lectures/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
