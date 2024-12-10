import express from "express";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express()

app.get("/api", (req, res) => {
    res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(process.env.PORT, () => {
    console.log("server started on port 5000")
});