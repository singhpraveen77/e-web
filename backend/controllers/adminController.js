import Order from "../models/ordermodel.js";
import Product from "../models/productmodel.js";
import User from "../models/usermodels.js";

export const getAllCount =async(req,res)=>{
    try {
        const userCount =await User.countDocuments();
        const productCount =await Product.countDocuments();
        const orderCount =await Order.countDocuments();

        return res.status(200).json({
            success:true,
            message:"count of all docs fetched !!",
            data:{userCount,productCount,orderCount},
        })
    } catch (error) {
        console.log("error in admin route",error);
        
        return res.status(500).json({
            success:false,
            data:null,
            message:error
        })
    }
}
