import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signUp = asyncHandler(async (req, res) => {
    try {
        const { email, username, password } = req.body || {};
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Email, Username, and Password are required" });
        }

        const normEmail = String(email).trim().toLowerCase();
        const normUsername = String(username).trim();

        const hashed = await bcrypt.hash(password, 12);

        const user = await User.create({
            email: normEmail,
            username: normUsername,
            password: hashed,
            accountType: "Follower",
            weeklyBudgetCents: 0,
            pantry: []
        });

        return res.status(201).json({
            user: {
                id: user._id,
                userId: user.userId,
                email: user.email,
                username: user.username,
                accountType: user.accountType,
                createdAt: user.createdAt
            }
        });
    } 
    catch (err) {
        if (err?.code === 11000) {
            const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
            return res.status(409).json({ message: `${field} Already In Use` });
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

        if (!user) return res.status(404).json({ message: "User Not found" });
        return res.json({ user });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});