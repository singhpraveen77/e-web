import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name !!"],
    },
    email: {
        type: String,
        required: [true, "please enter email"],
        unique: true,
        validate: [validator.isEmail, "please enter valid email"],
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "password is weak"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            // required:true,
        },
        url: {
            type: String,
            // required: true,
        },
        // defaul:"noUser"
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTtoken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d" // Token expires in 7 days
    });
};

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    try{
        const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + (15 * 60 * 1000);

    return resetToken;
    }
    catch(error){
        console.log("")
    }
};


const User = mongoose.model('User', userSchema);
export default User;








