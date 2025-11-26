import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Ingredient from "../models/ingredient.model.js";

dotenv.config();

const ACCOUNT_TYPES = ["Follower", "Creator", "Admin"];

export const signUp = asyncHandler(async (req, res) => {
    try {
        const { email, username, password, 
            accountType, weeklyBudgetCents, healthConditions, pantry 
        } = req.body || {};

        const userId = uuidv4();

        if (!email || !username || !password) {
            return res.status(400).json({ message: "Email, Username, and Password are required" });
        }

        const normEmail = String(email).trim().toLowerCase();
        const normUsername = String(username).trim();

        const hashed = await bcrypt.hash(password, 12);

        const user = await User.create({
            userId,
            email: normEmail,
            username: normUsername,
            password: hashed,
            accountType: ACCOUNT_TYPES.includes(accountType) ? accountType : "Follower",
            weeklyBudgetCents: Number.isFinite(Number(weeklyBudgetCents)) ? Number(weeklyBudgetCents) : 0,
            healthConditions : healthConditions ?? {},
            pantry: Array.isArray(pantry) ? pantry : []
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d"});

        return res.status(201).json({
            user: {
                id: user._id,
                userId: user.userId,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                createdAt: user.createdAt
            },
            token: token
        });
    } 
    catch (err) {
        if (err?.code === 11000) {
            const field = Object.keys(err.keyValue || {})[0] || "field";
            return res.status(409).json({ message: `${field} Already In Use` });
        }
        if (err?.name === "ValidationError") {
            const details = Object.fromEntries(
                Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
            );
            return res.status(400).json({ message: "Validation Error", details });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .select("userId username accountType weeklyBudgetCents pantry createdAt");

        if (!user) return res.status(404).json({ message: "User Not Found" });
        return res.json({ user });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const logIn = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Must Include Email and Password" });

        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "User Cannot Be Found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d"});

        return res.status(200).json({ message: "Login Successful", token});

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const { userID } = req.params;
        
        const user = await User.findOneAndUpdate( { userId: userID }, req.body, { new: true });

        if (!user) return res.status(404).json({ message: "User Not Found" });
        return res.status(200).json({ message: "User Has Been Updated", user: user});

    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const addPantryItem = asyncHandler(async (req, res) => {
    try {
        const { userID } = req.params;
        const { pantryID, count = 1 } = req.body;

        if (!pantryID || count <= 0) return res.status(400).json({ message: "Pantry Item ID Is Needed and Count Must Be Greater Than 0"});

        const ingredient = await Ingredient.findById({ pantryID }).lean();

        if (!ingredient) return res.status(404).json({ message: "Ingredient Cannot Be Found"});

        const result = await User.findOneAndUpdate(
            { userId: userID, "pantry.sourceId": { $ne: ingredient._id }},
            {
                $push: {
                    pantry: {
                        sourceId: ingredient.sourceId,
                        name: ingredient.name,
                        calories: ingredient.calories,
                        allergenType: ingredient.allergenType ?? [],
                        sourceVersion: 1,
                        count
                    }
                }
            },
            { new: true, runValidators: true }
        ).lean();

        if (result) return res.json({ message: "Pantry Item Added", user: result });

        const incResult = await User.findOneAndUpdate(
            { userId: userID, "pantry.sourceId": ingredient._id },
            { $inc: { "pantry.$.count": count } },
            { new: true, runValidators: true }
        ).lean();

        if (!incResult) return res.status(404).json({ message: "User Not Found"} );

        return res.json({ message: "Pantry Item Added and Incremented", user: incResult });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const updatePantry = asyncHandler(async (req, res) => {
    try {
        const { userID, ingredeintID } = req.params;
        const { count, incrementCount } = req.body;
        
        if (!Number.isFinite(count) || !Number.isFinite(incrementCount)) return res.status(400).json({ message: "Count and incrementCount Must Be Integers"});

        const user = await User.findOne( {userId: userID}, {pantry: 1} ).lean();

        if (!user) return res.status(404).json({ message: "User Not Found" });

        const ingredient = user.pantry.find(ing => String(ing.sourceId) === String(ingredeintID));

        if (!ingredient) return res.status(404).json({ message: "Pantry Item Not Found" });

        const newCount = Number.isFinite(count) ? count : ingredient.count + incrementCount;

        if (newCount <= 0) return res.status(400).json({ message: "New Item Count Cannot Be Less Than Zero" });

        const updatedUser = await User.findOneAndUpdate(
            { userId: userID, "pantry.sourceId": ingredeintID },
            { $set: { "pantry.$.count": newCount } },
            { new: true, runValidators: true }
         ).lean();

        return res.json({ message: "Pantry Item Updated", user: updatedUser });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deletePantryItem = asyncHandler(async (req, res) => {
    try {
        const { userID, ingredientID } = req.params;
        const updatedUser = await User.findOneAndUpdate(
            { userId: userID }, 
            { $pull: { pantry: ingredientID }},
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "Pantry Item Not Found" });

        return res.json({ message: "Pantry Item Has Been Successfully Deleted" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error"});
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        const deletedUser = await User.findOneAndDelete({id: id});
        if (!deletedUser) return res.status(404).json({ message: "User Not Found" });

        return res.json({ message: "User Has Been Sucessfully Deleted" });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});