import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter name !!"],


    },
    email:{
        required:[true,"please enter email"],
        unique:true,
        validator:[validator.isEmail,"please enter valid email"],
        lower:true
    },
    password:{
        type: String,
        required:true,
        minLength:[8,"password is weak"],
        select: false

    },
    profile:{
        public_id:{
            type:String,
            // required:true,
        },
        url:{
            type:String,
            required:true,
        },
        // defaul:"noUser"

        
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }

},{timestamps:true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });

userSchema.methods.getJWTtoken=function (){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_SECRET,
    })
}


userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
    
}


userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + (15 * 60 * 1000);

  return resetToken;
};









