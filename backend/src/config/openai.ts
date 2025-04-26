// import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
//  export const openai= new OpenAI({
//     apiKey:process.env.OPENAI_API_KEY
//  })

 import { GoogleGenAI } from "@google/genai";

 export const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

