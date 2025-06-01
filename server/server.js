import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from 'express-rate-limit';
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import RefreshRoute from "./routes/RefreshRoute.js";
import StudentRoute from "./routes/StudentRoute.js";
import UploadRoute from "./routes/UploadRoute.js";
import CourseRoute from "./routes/CourseRoute.js";
import ActivityRoute from "./routes/ActivityRoute.js";
import AIRoute from "./routes/AIRoute.js";
import AttendanceRoute from "./routes/AttendanceRoute.js";
import EnrollmentRoute from "./routes/EnrollmentRoute.js";
import AcademicYearRoute from "./routes/AcademicYearRoute.js";
import MailRoute from "./routes/MailRoute.js";
import RoomRoute from "./routes/RoomRoute.js";

import "./models/index.js";
import { verifyJWT } from "./middlewares/verifyJWT.js";

dotenv.config();

const app = express();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { 
        status: 429,
        message: 'Too many login attempts. Please wait.',
        remainingTime: 15 * 60 * 1000 
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

(async () => {
  try {
    await db.authenticate();
    console.log("Conexiune reușită la baza de date!");
  } catch (error) {
    console.error("Eroare la conectarea bazei de date:", error.message);
  }
})();

// Apply rate limiter to login route
app.use('/login', loginLimiter);
app.use(AuthRoute);
app.use(RefreshRoute);

app.use(verifyJWT);
app.use(UserRoute);
app.use(StudentRoute);
app.use(UploadRoute);
app.use(CourseRoute);
app.use(ActivityRoute);
app.use(AttendanceRoute);
app.use(AIRoute);
app.use(EnrollmentRoute);
app.use(AcademicYearRoute);
app.use(MailRoute);
app.use(RoomRoute);

app.listen(process.env.PORT, () => {
  console.log("server started on port 5000");
});
