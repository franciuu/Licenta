import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});

app.use(express.json());  // pentru a parsa corpul cererii JSON
app.use(express.urlencoded({ extended: true }));  // pentru a parsa formularele urlencoded

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24,
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

    await db.sync();
    console.log("Toate tabelele au fost sincronizate.");
  } catch (error) {
    console.error("Eroare la conectarea bazei de date:", error.message);
  }
})();

app.use(UserRoute);
app.use(AuthRoute);

app.listen(process.env.PORT, () => {
  console.log("server started on port 5000");
});
