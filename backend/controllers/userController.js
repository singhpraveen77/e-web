import User from "../models/usermodels.js"
import {  sendMail } from "../utlis/sendEmail.js";

import { ApiResponse } from "../utlis/ApiResponse.js";
import crypto from "crypto"
import validator from "validator"
import jwt from "jsonwebtoken";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utlis/cloudinary.js";
import {sendToken} from "../utlis/jwtTokens.js"


const registerUser = async (req, res) => {
    console.log("register hit !!");
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        if (!user) {
            user = new User({
                name,
                email,
                password,
                isVerified: false,
            });
            await user.save();
        } else {
            user.name = name;
            user.password = password;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.emailVerificationToken = otp;
        user.emailVerificationExpire = Date.now() + 5 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <tr>
                    <td style="padding: 30px 30px 20px; text-align: center; background-color: #4f46e5; color: white;">
                        <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Welcome to Our Platform</h1>
                    </td>
                </tr>
                
                <!-- Content -->
                <tr>
                    <td style="padding: 30px; color: #1f2937; line-height: 1.6;">
                        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #111827;">Verify Your Email Address</h2>
                        <p style="margin: 0 0 16px;">Thank you for registering! To complete your registration, please enter the following verification code in your application:</p>
                        
                        <!-- OTP Box -->
                        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                            <div style="display: inline-block; letter-spacing: 8px; font-size: 28px; font-weight: 700; color: #111827; background: white; padding: 16px 24px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                ${otp}
                            </div>
                        </div>
                        
                        <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280;">This code will expire in 5 minutes. If you didn't request this, please ignore this email.</p>
                        
                        <div style="border-top: 1px solid #e5e7eb; margin: 24px 0; padding-top: 24px; font-size: 13px; color: #6b7280;">
                            <p style="margin: 0 0 8px;">Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #4f46e5; text-decoration: none;">support@example.com</a></p>
                            <p style="margin: 0;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                        </div>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

        await sendMail(
            email,
            "Your verification code",
            html,
        );

        console.log("Verification OTP sent to:", email, otp);
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please enter it to complete registration.",
        });
    } catch (error) {
        console.log("error in backend !!",error);
        return res.status(400).json({
                success: false,
                message: "Registration failed. Please try again."
            });
        
    }
    
}

const verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(200).json({
                success: true,
                message: "Email already verified. You can log in.",
            });
        }

        if (!user.emailVerificationToken || !user.emailVerificationExpire) {
            return res.status(400).json({
                success: false,
                message: "No OTP found. Please request a new one.",
            });
        }

        if (user.emailVerificationExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one.",
            });
        }

        if (user.emailVerificationToken !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in.",
        });
    } catch (error) {
        console.error("verifyEmail error", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify email. Please try again.",
        });
    }
};
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

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
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
    console.log("checked reached  forget!! ");
    
    let  { email } = req.body;
    
    
    let user= await User.findOne({ email })
    
    if(!user){
        return res.status(404).send("User not found");
    }
    
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
    
const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #4f46e5; color: white;">
                <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 30px; color: #1f2937; line-height: 1.6;">
                <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: #111827;">Hello,</h2>
                <p style="margin: 0 0 16px;">We received a request to reset your password. Click the button below to choose a new one:</p>
                
                <!-- Button -->
                <table cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                    <tr>
                        <td align="center" style="border-radius: 6px; background: #4f46e5;">
                            <a href="${resetPasswordUrl}" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 600; letter-spacing: 0.5px;">
                                Reset My Password
                            </a>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280;">This link will expire in 15 minutes for security reasons.</p>
                
                <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 24px 0;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">If the button above doesn't work, copy and paste this link into your browser:</p>
                    <a href="${resetPasswordUrl}" style="color: #4f46e5; font-size: 13px; word-break: break-all; text-decoration: none;">${resetPasswordUrl}</a>
                </div>
                
                <p style="margin: 0 0 24px; font-size: 14px; color: #6b7280;">If you didn't request this, please ignore this email or contact support if you have questions.</p>
                
                <div style="border-top: 1px solid #e5e7eb; margin: 24px 0; padding-top: 24px; font-size: 13px; color: #6b7280;">
                    <p style="margin: 0 0 8px;">Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #4f46e5; text-decoration: none;">support@example.com</a></p>
                    <p style="margin: 0;">© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
  </div>
  <p style="text-align:center; margin-top:24px; font-size:11px; color:#9ca3af;">
    © ${new Date().getFullYear()} Your Company. All rights reserved.
  </p>
</div>

`;
    
    try{

        await sendMail(
         email,
        'Ecommerce password recovery',
        html,
    )
        
        console.log("checked reached  forget!! email sent ");
        
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
    console.log("checking the reset password a");
    
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
    
    console.log("reset password token",resetPasswordToken);
    
    console.log("checking the reset password a");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })
    
    
    if(!user){
        console.log("checking the reset password a user not found ");

        return res.status(404).send({
            success:false,
            message:"the token is wrong  or expired !!"
        });
    }
    
    console.log("checking the reset password a");
    if (password !== confirmPassword) {
        return  res.send("passes does not match");
    }
    console.log("checking the reset password a");
    
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
    
    console.log("checking the reset password a");

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
  batchUpdateUsers,
  registerUser,
  loginUser,
  logOutUser,
  forgotpassword,
  resetPassword,
  getUserdetail,
  updatePassword,
  updateProfile,
  getAllUsers,
  getAnyUser,
  updateUserRole,
  deleteUser,
  verifyEmail,
};
