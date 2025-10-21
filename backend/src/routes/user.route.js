import express from "express";
import { signUp, getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.get("/profile/:username", getUserProfile);

export default router;
