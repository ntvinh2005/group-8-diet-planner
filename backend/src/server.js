import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/dbConnect.js";
import userRoutes from "./routes/user.route.js";
import ingredientRoutes from "./routes/ingredient.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello From Server!");
})

app.use("/api/users", userRoutes);
app.use("/api/ingredients", ingredientRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Listening On Port http://localhost:${PORT}`);
        });
    }
    catch(err) {
        console.error("Failed to connect to MongoDB: ", err);
        process.exit(1);
    }
})();

