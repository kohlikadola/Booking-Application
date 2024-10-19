import express from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Calculate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/*---------LIBS----------*/
const app=express();
app.use(cookieParser());
const PORT=process.env.PORT||8000;
//DB URI
mongoose.connect(process.env.MONGO_URI)
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
/*--------------*/
//Server Listener
app.listen(PORT,()=>{
  console.log(`Server is Up at ${PORT} and DB is connected`);
});

