import axios from "axios";
import Cookies from "js-cookie";

// const FELIZA_AUTH_API = import.meta.env.VITE_API_URL;
const FELIZA_AUTH_API = "https://felizabackend.uz";
const request = axios.create({
  baseURL: FELIZA_AUTH_API,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use((config) => {
  const token = Cookies.get("FELIZA-TOKEN");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(config);
  return config;
});

export { request };
