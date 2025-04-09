import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//import routes
import auth from "./routes/auth.js";

//routes
app.use("/auth",auth);





