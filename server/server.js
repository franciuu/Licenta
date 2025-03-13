import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
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

import "./models/index.js";
import { verifyJWT } from "./middlewares/verifyJWT.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

(async () => {
  try {
    await db.authenticate();
    console.log("Conexiune reușită la baza de date!");

    await db.sync({ alter: true });
    console.log("Toate tabelele au fost sincronizate.");
  } catch (error) {
    console.error("Eroare la conectarea bazei de date:", error.message);
  }
})();

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

app.listen(process.env.PORT, () => {
  console.log("server started on port 5000");
});
