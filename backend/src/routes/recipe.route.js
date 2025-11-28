// Recipe Routes
import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRecipePerms } from "../middleware/authRecipePerms.middleware.js";
import { listRecipes,
    getRecipe,
    searchRecipe,
    rateRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
 } from "../controllers/recipe.controller.js";
 
const router = express.Router();

// Public Routes
router.get("/", listRecipes);
router.get("/search/query", searchRecipe);
router.get("/:recipeId", getRecipe);

// Private Routes
router.patch("/:recipeId/numStars", protectRoute, rateRecipe);
router.post("/create", protectRoute, authorizeRecipePerms, createRecipe);
router.put("/:recipeId", protectRoute, authorizeRecipePerms, updateRecipe);
router.delete("/:recipeId", protectRoute, authorizeRecipePerms, deleteRecipe);

export default router;