import express from "express";
import dotenv from "dotenv";

import userRoutes from "./routes/user.route.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello From Server");
})

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Listening On Port ${PORT}`);
});