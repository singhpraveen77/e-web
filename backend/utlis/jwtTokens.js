import  jwt  from "jsonwebtoken";
import ApiResponse from './ApiResponse.js'

const sendToken=(user,statusCode,res,message)=>{
    let token=user.getJWTtoken();

    const options={
        expires:new Date(
            Date.now()+(process.env.COOKIE_EXPIRE*24 * 60 *60*1000)),
            httpOnly:true,
    };

    res.status(statusCode).cookie("userToken",token).json(
        new ApiResponse(statusCode,options,message)
    )
}

export {sendToken} 

