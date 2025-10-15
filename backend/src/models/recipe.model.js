
import mongoose  from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        shortDesciption: {
            type: String,
            default: ""
        },
        numberOfStars: {
            type: Number,
            min: 0,
            max: 5
        },
        image: {
            type: String,
            required: true,
            default: ""
        }
    },
    { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;