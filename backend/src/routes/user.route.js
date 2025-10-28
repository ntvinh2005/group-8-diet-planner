import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signUp, 
    getUserProfile, 
    logIn,
    addPantryItem, 
    updatePantry, 
    updateUser,
    deletePantryItem, 
    deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// --- Public Routes ---

router.post("/signup", signUp);
router.get("/profile/:username", getUserProfile);
router.post("/login", logIn);


// --- Protected Routes ---

// User Updates
router.put("/:id", protectRoute, updateUser);
router.delete("/delete", protectRoute, deleteUser);

// Pantry Updates
router.post("/:id/pantry", protectRoute, addPantryItem);
router.patch("/:id/pantry/:ingredientId", protectRoute, updatePantry);
router.delete("/:id/pantry/:ingredientId", protectRoute, deletePantryItem);

export default router;
