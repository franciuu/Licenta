import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import db from "./config/database.js";

dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

(async () => {
  try {
    await db.authenticate();
    console.log("Conexiune reușită la baza de date!");

    // Creează automat tabelele definite în modele
    await db.sync();
    console.log("Toate tabelele au fost sincronizate.");
  } catch (error) {
    console.error("Eroare la conectarea bazei de date:", error.message);
  }
})();

app.get("/api", (req, res) => {
  res.json({ users: ["userOne", "userTwo", "userThree"] });
});

app.use(UserRoute);

app.listen(process.env.PORT, () => {
  console.log("server started on port 5000");
});
