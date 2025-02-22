import axios from "axios";
const URL = "http://localhost:5000";

export const axiosCustom = axios.create({
  baseURL: URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});
