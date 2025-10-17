import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/app/v1", // replace with your backend API UR
  
  withCredentials:true
});