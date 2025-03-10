import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
dotenv.config()
connectDb()

const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use("/api/user",userRoutes)



const PORT=process.env.PORTNUMBER||5001;
app.listen(PORT,()=>{
console.log("server is running at 5001")
})