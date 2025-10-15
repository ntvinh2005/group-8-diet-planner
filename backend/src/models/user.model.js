import mongoose from "mongoose";
import healthConditions from "../utils/healthConditions.js"

const pantryEntrySchema = new mongoose.Schema(
    {
        count: {
            type: Number,
            min: 0,
            default: 0
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
        },
        username: {
            type: String,
            required: true,
            unique: true,
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
        weeklyBudget: {
            type: Number,
            default: 0
        },
        pantry: {
            type: Map,
            of: pantryEntrySchema,
            default: {}
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
