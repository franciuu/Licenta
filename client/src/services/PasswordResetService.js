import axios from "axios";

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/password-reset/request",
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    throw error || { message: "Something went wrong." };
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/password-reset/reset",
      { token, password },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      }
    );
    return response.data;
  } catch (error) {
    throw error || { message: "Something went wrong." };
  }
}; 