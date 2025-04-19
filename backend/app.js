import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//import routes
import auth from "./routes/auth.js";

//routes
app.use("/auth", auth);

app.get("/", (req, res) => {
    res.send("working...");
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port `,PORT);
});





