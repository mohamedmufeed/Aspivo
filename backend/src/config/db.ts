
import mongoose from "mongoose";
import logger from "../logger";
const connectDb= async ()=>{
try {
    if(!process.env.MONOGO_URI){
        throw new Error("MONOGO_URI is not defined in the .env")
    }
    const connect= await mongoose.connect(process.env.MONOGO_URI)
    logger.info(`conncted ${connect.connection.host}`);
} catch (error) {
    logger.error('monogo db connecting error', error);
    return;
}
}


export default connectDb