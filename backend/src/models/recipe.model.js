import mongoose  from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        
    },
    { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;