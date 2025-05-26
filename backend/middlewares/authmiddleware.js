import jwt from "jsonwebtoken";

import User from "../models/usermodels.js";

const verifyJWT= async (req,res,next)=>{

    try{
        let {token} =req.cookies; 
        
        if(!token){
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

        req.user=await User.findById(decodeddata._id);
        if(!req.user){
            return res.status(400).json({
                success:false,
                message:"user not found with provided token",

            })
        }
        console.log("veritfied by middleware succesfully !!")
        // console.log(req.user)
        next();


        
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

    
