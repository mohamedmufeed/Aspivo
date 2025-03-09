import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Jwt } from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";
dotenv.config()

