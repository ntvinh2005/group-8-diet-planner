import mongoose from "mongoose";
import healthConditions from "../utils/healthConditions.js"
import { ALLERGENS } from "./ingredient.model.js";

const pantryItemSchema = new mongoose.Schema(
    {
        sourceId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Ingredient", 
            required: true 
        },
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
        },               
        sourceVersion: { 
            type: Number, 
            default: 1 
        },      
        count: { 
            type: Number, 
            min: 0, 
            default: 1 
        }
    }, 
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 32
        },
        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            enum: [ "Follower", "Creator", "Admin" ],
            default: "Follower"
        },
        healthConditions: {
            type: Map,
            of:  {
                type: String,
                enum: healthConditions
            },
            default: {}
        },
        weeklyBudgetCents: {
            type: Number,
            min: 0,
            default: 0
        },
        pantry: {
            type: [ pantryItemSchema ], 
            default: [] 
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
