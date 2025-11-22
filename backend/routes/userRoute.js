import express from 'express';
import { registerUser, loginUser, logOutUser, forgotpassword, resetPassword,getUserdetail, updatePassword, updateProfile, verifyEmail } from '../controllers/userController.js';
import { upload } from '../middlewares/multermiddleware.js';
import {verifyJWT} from '../middlewares/authmiddleware.js';


const Router = express.Router()

Router.route("/register").post(upload.single('avatar'), registerUser)

Router.route("/login").post(loginUser)
Router.route("/logout").get(verifyJWT,logOutUser)
Router.route("/password/forgot").post(forgotpassword)
Router.route("/password/verify-otp").post(resetPassword)
Router.route("/email/verify").post(verifyEmail)
Router.route("/me").get(verifyJWT, getUserdetail)
Router.route("/password/update").put(verifyJWT, updatePassword)

Router.route("/me/update").put(verifyJWT, upload.single('avatar'), updateProfile)

export default Router


