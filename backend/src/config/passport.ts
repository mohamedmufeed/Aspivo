import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv";


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:5001/api/user/google/callback",
    },

    async (access_token:string, refresh_token:string, profile:Profile, done:VerifyCallback) => {
      try {
        let user= await User.findOne({googleId:profile.id})
        if(!user){
            user = new User({
                googleId:profile.id,
                userName:profile.displayName,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                profileImage: profile.photos&& profile.photos.length>0? profile.photos[0].value:""
            })
            await user.save()
        }

        return done(null,user)
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);
passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });

export default passport