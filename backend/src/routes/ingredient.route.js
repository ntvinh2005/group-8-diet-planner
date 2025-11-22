import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRecipePerms } from "../middleware/authRecipePerms.middleware.js";
import { getIngredient, 
    searchIngredient, 
    createIngredient, 
    updateIngredient, 
    deleteIngredient 
} from "../controllers/ingredient.controller.js";

const router = express.Router();

// Public Routes
router.get("/:ingredientId", getIngredient);
router.get("search/query", searchIngredient);

// Protected Routes
router.post("/create", protectRoute, authorizeRecipePerms, createIngredient);
router.put("/:ingredientId", protectRoute, authorizeRecipePerms, updateIngredient);
router.delete("/:ingredientId", protectRoute, authorizeRecipePerms, deleteIngredient);

export default router;