export const sendMail = async (
  axiosCustom,
  students,
  attendancesCount,
  activity,
  professorName,
  professorEmail
) => {
  try {
    const response = await axiosCustom.post("/send-presence-mail", {
      students,
      attendancesCount,
      activity,
      professorName,
      professorEmail,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
