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
