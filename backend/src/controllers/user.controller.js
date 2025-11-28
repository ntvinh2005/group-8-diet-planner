import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import mongoose from "mongoose";
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
            .select("userId email username accountType healthConditions weeklyBudgetCents pantry createdAt");

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

        return res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                userId: user.userId,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export const updateUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const userFilter = mongoose.isValidObjectId(id) ? { _id: id } : { userId: id };

        const user = await User.findOneAndUpdate(userFilter, req.body, { new: true });

        if (!user) return res.status(404).json({ message: "User Not Found" });
        return res.status(200).json({ message: "User Has Been Updated", user: user});

    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const addPantryItem = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { sourceId, count = 1 } = req.body;

        if (!sourceId || count <= 0) return res.status(400).json({ message: "Ingredient ID Is Needed and Count Must Be Greater Than 0"});

        const ingredient = await Ingredient.findById(sourceId).lean();

        if (!ingredient) return res.status(404).json({ message: "Ingredient Cannot Be Found"});

        const userFilter = mongoose.isValidObjectId(id) ? { _id: id } : { userId: id };

        const result = await User.findOneAndUpdate(
            { ...userFilter, "pantry.sourceId": { $ne: ingredient._id }},
            {
                $push: {
                    pantry: {
                        sourceId: ingredient._id,
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
            { ...userFilter, "pantry.sourceId": ingredient._id },
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
        const { id, ingredientId } = req.params;
        const { count, incrementCount } = req.body;
        
        if (!Number.isFinite(count) && !Number.isFinite(incrementCount)) return res.status(400).json({ message: "Count or incrementCount Must Be Provided"});

        const userFilter = mongoose.isValidObjectId(id) ? { _id: id } : { userId: id };
        const user = await User.findOne( userFilter, {pantry: 1} ).lean();

        if (!user) return res.status(404).json({ message: "User Not Found" });

        const ingredient = user.pantry.find(ing => String(ing.sourceId) === String(ingredientId));

        if (!ingredient) return res.status(404).json({ message: "Pantry Item Not Found" });

        const newCount = Number.isFinite(count) ? count : ingredient.count + (incrementCount || 0);

        if (newCount <= 0) return res.status(400).json({ message: "New Item Count Cannot Be Less Than Zero" });

        const updatedUser = await User.findOneAndUpdate(
            { ...userFilter, "pantry.sourceId": ingredientId },
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
        const { id, ingredientId } = req.params;
        const userFilter = mongoose.isValidObjectId(id) ? { _id: id } : { userId: id };
        const updatedUser = await User.findOneAndUpdate(
            userFilter,
            { $pull: { pantry: { sourceId: ingredientId } }},
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "Pantry Item Not Found" });

        return res.json({ message: "Pantry Item Has Been Successfully Deleted" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error"});
    }
});

export const upgradeToCreator = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const userFilter = mongoose.isValidObjectId(userId) ? { _id: userId } : { userId: userId };
        
        const user = await User.findOne(userFilter);
        
        if (!user) return res.status(404).json({ message: "User Not Found" });
        
        if (user.accountType === "Creator" || user.accountType === "Admin") {
            return res.status(400).json({ message: "User is already a Creator or Admin" });
        }
        
        user.accountType = "Creator";
        await user.save();
        
        return res.json({ 
            user: {
                userId: user.userId,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                healthConditions: user.healthConditions,
                weeklyBudgetCents: user.weeklyBudgetCents,
                pantry: user.pantry
            },
            message: "Successfully upgraded to Creator" 
        });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const downgradeToFollower = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const userFilter = mongoose.isValidObjectId(userId) ? { _id: userId } : { userId: userId };
        
        const user = await User.findOne(userFilter);
        
        if (!user) return res.status(404).json({ message: "User Not Found" });
        
        if (user.accountType === "Admin") {
            return res.status(400).json({ message: "Admins cannot downgrade" });
        }
        
        if (user.accountType === "Follower") {
            return res.status(400).json({ message: "User is already a Follower" });
        }
        
        user.accountType = "Follower";
        await user.save();
        
        return res.json({ 
            user: {
                userId: user.userId,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                healthConditions: user.healthConditions,
                weeklyBudgetCents: user.weeklyBudgetCents,
                pantry: user.pantry
            },
            message: "Successfully downgraded to Follower" 
        });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });
        const userFilter = mongoose.isValidObjectId(userId) ? { _id: userId } : { userId: userId };
        const deletedUser = await User.findOneAndDelete(userFilter);
        if (!deletedUser) return res.status(404).json({ message: "User Not Found" });

        return res.json({ message: "User Has Been Successfully Deleted" });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" });
    }
});