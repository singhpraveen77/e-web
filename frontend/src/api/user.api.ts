import { axiosInstance } from "../axios/axiosInstance";
import { AxiosResponse } from "axios";

// Define interfaces for your data types
interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  avatar?: File; // Optional if you're uploading images
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
}

export const Login = async (formData: LoginFormData): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse<AuthResponse> = await axiosInstance.post(
      "/user/login", 
      formData
    );
    console.log("✅ Login success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
};

export const Register = async (formData: FormData | RegisterFormData): Promise<AuthResponse> => {
  try {
    const res: AxiosResponse<AuthResponse> = await axiosInstance.post(
      "/user/register", 
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log("✅ Register success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Register error:", error);
    throw error;
  }
};
