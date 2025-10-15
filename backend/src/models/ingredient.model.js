import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    calorie: {
        type: Number,
        required: true
    },
    allergenType: {
        type: [String],
        enum: ["Milk", "Eggs", "Nuts", "Seasame", "Wheat", "Soy"],
        default: []
    }
});

export default Ingredient = mongoose.model("Ingredient", ingredientSchema);