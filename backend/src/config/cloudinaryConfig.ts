import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
dotenv.config()
cloudinary.config({
    cloud_name:"do4wdvbcy",
    api_key:"398738496838286",
    api_secret:process.env.CLOUD_SECRET
})
 export default cloudinary