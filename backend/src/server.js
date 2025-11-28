import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/dbConnect.js";
import userRoutes from "./routes/user.route.js";
import recipeRoutes from "./routes/recipe.route.js";
import ingredientRoutes from "./routes/ingredient.route.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
// Configure CORS: allow origins from environment or fall back to common dev ports
const allowedOrigins = process.env.FRONTEND_ORIGINS
    ? process.env.FRONTEND_ORIGINS.split(",").map((s) => s.trim())
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow non-browser requests (e.g. curl, server-to-server) where origin is undefined
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        },
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello From Server!");
})

app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
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

