// Recipe Routes
import express from "express"
import { protectRoute } from "../middleware/auth.middleware";
import { authorizeRecipePerms } from "../middleware/authRecipePerms.middleware.js";
import { listRecipes,
    getRecipe,
    rateRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe
 } from "../controllers/recipe.controller.js";
 
const router = express.Router();

// Public Routes
router.get("/", listRecipes);
router.get("/:recipeID", getRecipe);

// Private Routes
router.patch("/:recipeID/numStars", protectRoute, rateRecipe);
router.post("/create", protectRoute, authorizeRecipePerms, createRecipe);
router.put("/:recipeID", protectRoute, authorizeRecipePerms, updateRecipe);
router.delete("/:recipeID", protectRoute, authorizeRecipePerms, deleteRecipe);

export default router;