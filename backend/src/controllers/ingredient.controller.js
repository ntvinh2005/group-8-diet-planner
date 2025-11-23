// Controller For Ingredients
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { Ingredient, ALLERGENS } from '../models/ingredient.model.js';

dotenv.config();

export const getIngredient = asyncHandler(async (req, res) => {
    try {
        const { ingredientID } = req.params;

        const ingredient = await Ingredient.findById(ingredientID);

        if (!ingredient) return res.status(404).json({ message: "Ingredient Not Found" });

        return res.status(200).json( { ingredient });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const searchIngredient =  asyncHandler(async (req, res) => {
    try {
        const { query, allergen, caloriesMin, caloriesMax } = req.query;

        const filter = {};

        if (query) filter.name = { $regex: query, $options: "i" };

        if (allergen) filter.allergenType = allergen;

        if (caloriesMin !== undefined || caloriesMax !== undefined) {
            filter.calories = {};
            if (caloriesMin) filter.calories.$gte = Number(caloriesMin);
            if (caloriesMax) filter.calories.$lte = Number(caloriesMax);
        }

        const ingredientsFound = await Ingredient.find(filter);

        return res.status(200).json({ ingredientsFound });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const createIngredient =  asyncHandler(async (req, res) => {
    try {

        const { ingredientName, ingredientCalories, ingredientAllergens } = req.body;

        if (!(typeof ingredientName === "string" && ingredient.trim().length > 0)) return req.status(400).json({ message: "Ingredient Name Must Be a String" });

        if (!(Number.isFinite(Number(ingredientCalories)))) return req.status(400).json({ message: "Ingredient Calorie Count Must Be a Number" });

        if (ingredientCalories < 0) return req.status(400).json({ message: "Calorie Count Must Be Positive" });

        const validationHelper = (arr, arrAllowed) => {
            return (Array.isArray(arr) && arr.every(item => typeof item === "string" && arrAllowed.includes(item)));
        } 

        if (!validationHelper(ingredientAllergens, ALLERGENS)) return req.status(400).json({ message: "Allergen List Must Have Valid Allergen Types" });

        const ingredient = await Ingredient.create({
            name: ingredientName,
            calories: ingredientCalories,
            allergenType: ingredientAllergens
        });

        return res.status(201).json({ message: "Ingredient Successfully Created", ingredient });

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const updateIngredient =  asyncHandler(async (req, res) => {
    try {
        const { ingredientID } = req.params;

        const updatedIngredient = await Ingredient.findByIdAndUpdate(ingredientID, req.body, { new: true, runValidators: true });

        if (!updatedIngredient) return res.status(404).json({ message: "Ingredient Not Found" });

        return res.status(200).json({ message: "Ingredient Successfully Updated", updatedIngredient});
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deleteIngredient =  asyncHandler(async (req, res) => {
    try {
        const { ingredientID } = req.params;

        const ingredientDeleted = await Ingredient.findByIdAndUpdate(ingredientID);

        if (!deleteIngredient) return res.status(404).json({ message: "Ingredient Not Found" });

        return res.status(200).json({ message: "Ingredient Sucessfully Deleted", ingredientID});

    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

