import User from "../models/usermodels.js"
import { sendEmail } from "../utlis/sendEmail.js";

import { ApiResponse } from "../utlis/ApiResponse.js";
import crypto from "crypto"
import validator from "validator"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utlis/cloudinary.js";
import {sendToken} from "../utlis/jwtTokens.js"


const registerUser = async (req, res) => {
    console.log("register hit !!");
    try {
        const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email})

    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const avatarLocalPath = req.file?.path;    
    
    if (!avatarLocalPath) {
        return res.status(400).send("Please upload an avatar image");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars")

    if (!avatar) {
        return res.status(500).send("Failed to upload avatar image");
    }
    
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: avatar.public_id,
            url: avatar.url
        },
    })

    let token = user.getJWTtoken();
        
        // Same cookie settings
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 5 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        console.log("data sent from backend :",user);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user:user,
            token
        });
    } catch (error) {
        console.log("error in backend !!",error);
        return res.status(400).json({
                success: false,
                message: "Please valid email !!"
            });
        
    }
    
}
const loginUser = async (req, res) => {
    console.log("login hit !!", req.body);
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        let user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        let token = user.getJWTtoken();
        
        // 🔥 PRODUCTION-READY COOKIE SETTINGS
        res.cookie("token", token, {
            httpOnly: true,        // Prevents JavaScript access (security)
            secure: true,          // HTTPS only (required for production)
            sameSite: 'none',      // Allows cross-origin cookies
            maxAge: 5 * 24 * 60 * 60 * 1000,  // 5 days in milliseconds
            path: '/'              // Available on all routes
        });
        
        console.log("✅ Token set in cookie:", token);
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token  // Also send token in response (optional)
        });
        
    } catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};


const logOutUser = async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
};

const forgotpassword = async (req, res) => {
    let  { email } = req.body;

    let user= await User.findOne({ email })

    if(!user){
        return res.status(404).send("User not found");


    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/app/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n ${resetPasswordUrl} \n\nIf you have not requested this email, please ignore it.`;

    try{
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery`,
            message,
        })
        

        res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });
    }
    catch(error){
        await User.updateOne({
            _id:user._id

        },
        {
            $unset:{
                resetPasswordToken: "",
                resetPasswordExpire: ""
            }
        })
        res.status(500).json({ success: false, message:error.message });
    }
    
}

const resetPassword = async (req, res) => {

    const { token } = req.params
    const { password, confirmPassword } = req.body

    // return res.send(token)

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })


    if(!user){
        return res.status(404).send("the token is wrong  or expired !!");
    }

    if (password !== confirmPassword) {
        return  res.send("passes does not match");
    }

    user.password = password
    await user.save()
    await User.updateOne(
        {
            _id: user._id
        },
        {
            $unset: {
                resetPasswordToken: "",
                resetPasswordExpire: ""
            }
        }
    );


    sendToken(user, 200, res, "Password reset successfully");
    
}

const getUserdetail = async (req,res) =>{
   
    console.log("/me route hit !! ");
    const user = await User.findById(req.user?.id);

    if(!user){
        return res.status(400).json(
            {
                success:false,
                message:"user not set correctly check /me route cookie",
                
            }
        );

    }
    
    return res.status(200).json(
        {
            success:true,
            message:"user fetched successfully",
            data:user
        }
    );

}


const updatePassword = async (req, res) => {

    // const user = await User.findById(req?.user?._id).select("+password");
    const user = await User.findOne({email:req.body.email}).select("+password");

    // return res.send(req.body.oldPassword);
    const isPasswordMatched = await user.isPasswordCorrect(req.body.oldPassword)


    if (!isPasswordMatched) {
        return res.status(400).json("Old Password is incorrect")
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return res(400).json("Password does not match");
    }

    user.password = req.body.newPassword;
    await user.save()

    res.status(200).json(new ApiResponse(200, user, "password changed successfully"))

}

const updateProfile =async (req,res)=>{
    let {name,email}=req.body;

    if(name==null || email==null){
        return res.status(400).send("NAME AND EMAIL ARE REQUIRED ");
    }

    name=name.trim();
    email=email.trim();

    if(validator.isEmail(email)==false){
        return res.status(400).send("enter valid email")
    }

    let avatar;

    if(!req.file?.path){
        const avatarLocalPath= req.file.path;

        avatar=await uploadOnCloudinary(avatarLocalPath,"avatars");

        if(!avatar){
            return res.status(400).send("unable to upload file ");
        }

    }

    let updatedata={
        name,
        email
    }

    if(avatar){
        updatedata.avatar=avatar;
    }

    const updatedUser=await User.findByIdAndUpdate(
        req.user._id,
        {$set:updatedata},
        {
            new:true,
            runValidators:true
        }

    )

    if(!updatedUser){
        return res.status(404).json("user not found");
    }

    res.status(200).json("user updated successfully");

}


const getAllUsers=async(req,res)=>{
    let user=await User.find();

    return res.status(200).json(
        {
            success:true,
            message:"user fetched successfully",
            data:user
        }
    );
}

const getAnyUser = async (req,res)=>{
    try{
        let userId=req.params._id;

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"VALID USERID required",

            })
        }
        
        let user=await User.findById(userId);
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"VALID USERID required",
    
            })
            
        }
        
        return res.status(200).json({
            success:true,
            message:"USER FOUND SUCCESSFULLY",
            data:user
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"something went wrong",
            error:error.message
    
        })

    }
}


const updateUserRole= async (req,res)=>{
    let {name,email,role}=req.body;

    if(!name || !email || !role){
        return res.status(400).json({
            success:false,
            message:"PLEASE enter the valid credentials"
        })
    }

     name=name.trim();
     email=email.trim();

     if(!validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"PLEASE enter the valid credentials"
        })
     }

    let user= await User.findByIdAndUpdate(
        req.params?._id,
        
        {
            $set:
            {name,email,role}
        },
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
            //mistake by rudra bhai..

        }
    )

    if(user===null){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }
    return res.status(200).json({
        success:true,
        message:"user role UPDATED successfully",
        data:user
    })


}


const deleteUser= async(req,res)=>{
    let user=await User.findById(req.params?._id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found",

        })

    }

    if(user?.image){
       await deleteFromCloudinary(user?.image?.public_id);
    }

    await user.deleteOne();

    res.status(200).json({
        message:"user deleted successfully",
        success:true,

    })

}


const batchUpdateUsers = async (req, res) => {
  try {
    const { updatedRoles = {}, deleted = [] } = req.body;

    // 🔹 Collect results
    const updateResults = [];
    const deleteResults = [];

    // 🔹 1️⃣ Update roles in bulk
    for (const [id, role] of Object.entries(updatedRoles)) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true, useFindAndModify: false }
      );

      if (updatedUser) updateResults.push(updatedUser);
    }

    // 🔹 2️⃣ Delete users in bulk
    for (const id of deleted) {
      const user = await User.findById(id);
      if (!user) continue;

      // delete profile image if present
      if (user.image && user.image.public_id) {
        await deleteFromCloudinary(user.image.public_id);
      }

      await user.deleteOne();
      deleteResults.push(id);
    }

    return res.status(200).json({
      success: true,
      message: "Batch update completed successfully ✅",
      summary: {
        updatedCount: updateResults.length,
        deletedCount: deleteResults.length,
      },
      updatedUsers: updateResults,
      deletedUsers: deleteResults,
    });
  } catch (err) {
    console.error("Error in batch user update:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error during batch update ❌",
      error: err.message,
    });
  }
};



export {
    batchUpdateUsers, registerUser, loginUser ,logOutUser,forgotpassword, resetPassword,getUserdetail,updatePassword,updateProfile,getAllUsers,getAnyUser,updateUserRole,deleteUser};

