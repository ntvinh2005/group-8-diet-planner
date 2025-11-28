import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { signUp, 
    getUserProfile, 
    logIn,
    addPantryItem, 
    updatePantry, 
    updateUser,
    deletePantryItem,
    upgradeToCreator,
    downgradeToFollower,
    deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// --- Public Routes ---

router.post("/signup", signUp);
router.get("/profile/:username", getUserProfile);
router.post("/login", logIn);


// --- Protected Routes ---

// User Updates
router.put("/:id", protectRoute, updateUser);
router.patch("/upgrade-to-creator", protectRoute, upgradeToCreator);
router.patch("/downgrade-to-follower", protectRoute, downgradeToFollower);
router.delete("/delete", protectRoute, deleteUser);

// Pantry Updates
router.post("/:id/pantry", protectRoute, addPantryItem);
router.patch("/:id/pantry/:ingredientId", protectRoute, updatePantry);
router.delete("/:id/pantry/:ingredientId", protectRoute, deletePantryItem);

export default router;
