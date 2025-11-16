import express from 'express';
import cloudinary from 'cloudinary'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import 'dotenv/config';
dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://e-web-39px.onrender.com',
  process.env.CORS_ORIGIN 
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_ATLAS)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

    
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//import routes
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import orderRoute from "./routes/orderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { verifyJWT,authrizeroles } from './middlewares/authmiddleware.js';

//uptime robot 

app.get("/",(req,res)=>{
  return res.send("// server is up ")
})

//routes
app.use("/app/v1/user",userRoute);
app.use("/app/v1/product",productRoute );
app.use("/app/v1/review",reviewRoute );
app.use("/app/v1/order",orderRoute );

app.use(verifyJWT, authrizeroles("admin"));

app.use("/app/v1/admin",adminRoute );



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port `,PORT);
});

