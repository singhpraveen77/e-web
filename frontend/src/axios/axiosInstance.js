import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/app/v1";


export const axiosInstance = axios.create({
  baseURL:BASE_URL, // replace with your backend API UR
  
  withCredentials:true
});