// Controller For Recipes
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Recipe from '../models/recipe.model.js';

dotenv.config();

export const listRecipes = asyncHandler(async (req, res) => {
    try {
        const { query, starsMin, starsMax, limitPerPage } = req.query;

        const filter = {};

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" }},
                { shortDescription: { $regex: query, $options: "i" }},
                { longDescription: { $regex: query, $options: "i" }}
            ];
        }

        if (starsMin !== undefined || starsMax !== undefined) {
            filter.numberOfStars = {};
            if (starsMin !== undefined) filter.numberOfStars.$gte = Number(starsMin);
            if (starsMax !== undefined) filter.numberOfStars.$lte = Number(starsMax);
        }

        const [results, resultsTotal] = await Promise.all([
            Recipe.find(filter).limit(Number(limitPerPage) || 10),
            Recipe.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(resultsTotal / (Number(limitPerPage) || 10));

        return res.status(200).json({
            results,
            limit: Number(limitPerPage) || 10,
            resultsTotal,
            totalPages
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const getRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeId } = req.params;
        
        const recipe = await Recipe.findById(recipeId);
        
        if (!recipe) return res.status(404).json({ message: "Recipe Not Found" });
        
        return res.status(200).json(recipe);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const searchRecipe = asyncHandler(async (req, res) => {
    try {
        const { q } = req.query;

        const filter = {};
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: "i" }},
                { shortDesciption: { $regex: q, $options: "i" }},
                { longDesciption: { $regex: q, $options: "i" }}
            ];
        }

        const recipes = await Recipe.find(filter).limit(10);
        return res.status(200).json(recipes);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const rateRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeId } = req.params;
        const { rating } = req.body;

        let stars = Number(rating)

        if (!Number.isFinite(stars)) return res.status(400).json({ message: "Number of Stars Must Be a Number" });

        if (stars < 0) stars = 0;
        if (stars > 5) stars = 5;

        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            { numberOfStars: stars },
            { new: true, runValidators: true }
        );

        if (!recipe) return res.status(404).json({ message: "Recipe Not Found" });

        return res.status(200).json(recipe);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const createRecipe = asyncHandler(async (req, res) => {
    try {
        const { name, shortDesciption, longDesciption, image } = req.body;

        if (!name) return res.status(400).json({ message: "Recipe Name Is Required" });

        const newRecipe = await Recipe.create({
            name: name.trim(),
            shortDesciption: shortDesciption ?? "",
            longDesciption: longDesciption ?? "",
            image: image ?? ""
        });

        return res.status(201).json(newRecipe);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const updateRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeId } = req.params;

        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true, runValidators: true });

        if (!updatedRecipe) return res.status(404).json({ message: "Recipe Not Found" });

        return res.status(200).json(updatedRecipe);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deleteRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeId } = req.params;
        
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
        
        if (!deletedRecipe) return res.status(404).json({ message: "Recipe Not Found" });
        
        return res.status(200).json({ message: "Recipe Successfully Deleted", recipeId});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});