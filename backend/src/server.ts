import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import companyRoutes from "./routes/companyRoutes";
import messageRoutes from "./routes/messageRoutes"
import stripeRoutes from "./routes/stripeRoutes";
import cookieParser from "cookie-parser";
import passport from "./config/passport";
import session from "express-session";
import http from "http";
import setupSocket from "./config/socket";
import morgan from "morgan"
import logger from "./logger";

dotenv.config();
connectDb();

const app = express();
const server = http.createServer(app);



app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res, next) => {
        next();
    }
);

app.use(
    morgan('tiny', {
      stream: {
        write: (message:string) => logger.info(message.trim())
      }
    })
  );


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "Mufeed",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/message", messageRoutes)

const { io, sendNotification } = setupSocket(server);

const PORT = process.env.PORTNUMBER || 5001;
server.listen(PORT, () => {
    logger.info(`Server is running at ${PORT}`)
});

export { io, sendNotification };