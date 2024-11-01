import express from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import myHotelRoutes from './routes/my-hotels.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {v2 as cloudinary} from 'cloudinary';

import multer from 'multer';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*---------LIBS----------*/
const app=express();
app.use(cookieParser());
const PORT=process.env.PORT||8000;
//cloudinary
cloudinary.config({
  cloud_name:process.env.CLOUD,
  api_key:process.env.CLOUD_API,
  api_secret:process.env.CLOUD_SEC

});

//DB URI
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

// Call the connectDB function
connectDB();

//mongoose.connect(process.env.MONGO_URI)
//Filter  Json req's
app.use(express.json());/*JSON Body Parser*/
app.use(express.urlencoded({extended:true}));
//MIDDLEWARE
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true,
}));
/*---Test-Route---*/
app.get("/test", async (req, res) => {
  try {
      return res.status(200).send({ message: "Hello !" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
/*----Routes----*/
app.use(express.static(path.join(__dirname,"../../frontend/dist")));
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/my-hotels",myHotelRoutes);
/*--------------*/
//Server Listener
app.listen(PORT,()=>{
  console.log(`Server is Up at ${PORT} and DB is connected`);
});

