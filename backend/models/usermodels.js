import mongoose from "mongoose";

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
        type:String,
        default:"noUser"
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }

},{timestamps:true});

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       next();
//     }
  
//     this.password = await bcrypt.hash(this.password, 10);
//   });

userSchema.method.getJWTtoken=function (){
    return JsonWebTokenError.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_SECRET,
    })
}








