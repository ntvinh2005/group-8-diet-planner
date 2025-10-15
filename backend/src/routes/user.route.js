import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Route
router.get("/profile/:username", getUserProfile);

// Protected Routes
// router.post("", protectRoute);
// router.get("", protectRoute);
// router.put("", protectRoute);
// router.post("", protectRoute);

export default router;