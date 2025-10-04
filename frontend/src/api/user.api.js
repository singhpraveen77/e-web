import { axiosInstance } from "../axios/axiosInstance"

export const Login = async (formData) => {
  try {
    const res = await axiosInstance.post("/v1/user/login", formData);
    console.log("✅ Login success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Login error:");
    throw error;
  }
};

export const Register = async (formData) => {
  try {
    const res = await axiosInstance.post("/v1/user/register", formData,{
       headers: { "Content-Type": "multipart/form-data" },
    });
   
    console.log("✅ register success:", res.data);
    
   return res.data;
  } catch (error) {
    console.error("❌ register error:",error);
    throw error;
  }
};
