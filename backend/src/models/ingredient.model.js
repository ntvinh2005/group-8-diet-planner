import mongoose from "mongoose";

export const ALLERGENS = ["Milk", "Eggs", "Nuts", "Sesame", "Wheat", "Soy"];

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    allergenType: {
        type: [String],
        enum: ALLERGENS,
        default: []
    }
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

export default Ingredient;