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

    async (access_token: string, refresh_token: string, profile: Profile, done: VerifyCallback) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const existingUser = await User.findOne({ email: profile.emails && profile.emails[0]?.value });

          if (existingUser) {
            existingUser.googleId = profile.id;
            existingUser.verified = true;
            existingUser.userName = profile.displayName;
            existingUser.profileImage = profile.photos?.[0]?.value || "";
            await existingUser.save();
            return done(null, existingUser);
          } else {
            user = new User({
              googleId: profile.id,
              userName: profile.displayName,
              email: profile.emails?.[0]?.value || "",
              profileImage: profile.photos?.[0]?.value || "",
              verified: true,
            });
            await user.save();
          }
        }

        return done(null, user);
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

export default passport;
