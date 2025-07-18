import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://canineracks-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;