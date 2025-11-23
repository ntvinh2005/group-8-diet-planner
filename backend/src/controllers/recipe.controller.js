// Controller For Recipes
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import Recipe from '../models/recipe.model';

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
            Recipe.find(filter).limit(Number(limitPerPage), 
            Recipe.countDocuments(filter))
        ]);

        return res.status(200).json({
            results,
            limit: Number(limitPerPage),
            resultsTotal,
            totalPages: Math.ceil(totalPages / limitPerPage)
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const getRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeID } = req.params;
        
        const recipe = await Recipe.findById(recipeID);
        
        if (!recipe) return res.status(404).json({ message: "Recipe Not Found" });
        
        return res.status(200).json( { recipe });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const rateRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeID, numberStars } = req.params;

        let stars = Number(numberStars)

        if (!Number.isFinite(stars)) return res.status(400).json({ message: "Number of Stars Must Be a Number" });

        if (stars < 0) stars = 0;
        if (stars > 5) stars = 5;

        const recipe = await Recipe.findByIdAndUpdate(
            recipeID,
            { numberOfStars: stars },
            { new: true, runValidators: true }
        );

        if (!recipe) return res.status(404).json({ message: "Recipe Not Found" });

        return res.status(200).json({ message: "Recipe Sucessfully Rated", recipe });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const createRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeName, recipeShortDescription, recipeLongDescription, recipeImage } = req.body;

        if (!recipeName) return res.status(400).json({ message: "Recipe Name Is Neeeded" });

        const newRecipe = await Recipe.create({
            name: recipeName.trim(),
            shortDescription: recipeShortDescription ?? "",
            longDesciption: recipeLongDescription ?? "",
            image: recipeImage ?? ""
        });

        return res.status(201).json({ message: "Recipe Successfully Created", newRecipe});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const updateRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeID } = req.params;

        const updatedRecipe = await Recipe.findByIdAndUpdate(recipeID, req.body, { new: true, runValidators: true });

        if (!updatedRecipe) return res.status(404).json({ message: "Recipe Not Found" });

        return res.status(200).json({ message: "Recipe Successfully Updated", updatedRecipe});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deleteRecipe = asyncHandler(async (req, res) => {
    try {
        const { recipeID } = req.params;
        
        const deletedRecipe = await Recipe.findByIdAndUpdate(recipeID);
        
        if (!deletedRecipe) return res.status(404).json({ message: "Recipe Not Found" });
        
        return res.status(200).json({ message: "Recipe Sucessfully Deleted", recipeID});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});