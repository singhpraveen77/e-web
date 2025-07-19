import jwt from "jsonwebtoken";

import User from "../models/usermodels.js";

const verifyJWT= async (req,res,next)=>{
    console.log("token verify jwt !!")

    try{
        let {token} =req.cookies; 

        console.log("token",token)
        
        if(!token){
            console.log("token not found !!")
            return res.status(400).json({
                success:false,
                message:"please login first",

            })
        }

        let decodeddata=jwt.verify(token,process.env.JWT_SECRET);

        if(!decodeddata || !decodeddata._id){
            return res.status(400).json({
                success:false,
                message:"not valid token",

            })
        }


         const user = await User.findById(decodeddata._id).select('-password');        if(!req.user){
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        console.log("✅ Verified by middleware successfully!");
        next();    
    }
}
catch(e){
        console.log("somthing went worng in the middleware auth")
        return res.status(400).json({
            success:false,
            message:e.message,
            
    
        })
    }
};

const authrizeroles=(...roles)=>{
        
            return (req,res,next)=>{
                if(!roles.includes(req.user.role)){
                    return res.status(400).json({
                        success:false,
                        message:`unauthorized role found ${req.user.role}`,
                        
        
                    })
                }
                next();
            }

        
        
}

export {verifyJWT,authrizeroles};

    
