import User from "../models/usermodels.js"




const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email
        
    })

    if (existingUser) {
        return res.status(400).send("User already exists");
    }

    const avatarLocalPath = req.file?.path;

    // if (!avatarLocalPath) {
    //     return res.status(400).send("Please upload an avatar image");
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars")

    // if (!avatar) {
    //     return res.status(500).send("Failed to upload avatar image");
    // }
    
    const user = await User.create({
        name,
        email,
        password,
        // avatar: {
        //     public_id: avatar.public_id,
        //     url: avatar.url
        // },
    })

    const token = user.getJWTtoken();
    res.cookie("token", token, )
    res.status(201).send({ message: "User registered successfully"});

}

const  loginUser=async (req,res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Please provide email and password");
    }

    let user = await User.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).send("Invalid email or password");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(401).send("Invalid email or password");
    }

    let token = user.getJWTtoken();
    res.cookie("token",token);
    res.status(200).json({message: "login success"});
  
}

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

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

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
        res.status(500).json({ success: false, message:"Error in sending the Email .... please try again later !!" });
    }
    
}


export { registerUser, loginUser ,logOutUser,forgotpassword};

