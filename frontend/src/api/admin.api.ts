import axios from "axios"
import { axiosInstance } from "../axios/axiosInstance"

export const  getAllCount=async()=>{
    try {
        const res=await axiosInstance.get("/admin/detail/all");
        return res.data;
    } catch (error) {
        console.log("error in admin api get count",error);
        
        return error;
    }
}