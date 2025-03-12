import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import cookieparser from "cookie-parser";



dotenv.config()
connectDb()

const app=express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use("/api/user",userRoutes)
app.use("/api/admin",adminRoutes)



const PORT=process.env.PORTNUMBER||5001;
app.listen(PORT,()=>{
console.log("server is running at 5001")
})