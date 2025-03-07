import { error } from "console";
import mongoose from "mongoose";
const connectDb= async ()=>{
try {
    if(!process.env.MONOGO_URI){
        throw new Error("MONOGO_URI is not defined in the .env")
    }
    const connect= await mongoose.connect(process.env.MONOGO_URI)
    console.log('conncted', connect.connection.host);
} catch (error) {
    console.log('monogo db connecting error', error);
    return;
}
}


export default connectDb