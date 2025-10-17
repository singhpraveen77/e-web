import { axiosInstance } from "../axios/axiosInstance"


export const AllProducts= async ()=>{

    try {
        const res=await axiosInstance.get("/admin/product/all");
        console.log("res in products api :",res);
        const products= res?.data?.data;
        console.log("resolved products:",products);

        return products;
    } catch (error) {
        console.log("products error api:",error);
        
    }

}

export const ViewProducts= async ()=>{

    try {
        const res=await axiosInstance.get("/product/viewall");
        console.log("res in products api view all:",res);
        const products= res?.data?.data;
        console.log("resolved products:",products);

        return products;
    } catch (error) {
        console.log("products error api:",error);
        
    }

}

interface ProductResponse {
  success: boolean;
  message: string;
  data: any; // Replace with your product type
}

export const AddProductapi = async (data: FormData): Promise<ProductResponse> => {
  try {
    const res = await axiosInstance.post("/admin/product/new", data, {
    });
    return res.data;
  } catch (error: any) {
    console.error("Error in add product API frontend:", error);
    throw error; // Re-throw to handle in component
  }
};