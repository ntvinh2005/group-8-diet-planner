import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const authorizeRecipePerms = asyncHandler( async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?._id;

        if (!userId) return res.status(400).json({ message: "User Id Is Required" });

        const userFilter = mongoose.isValidObjectId(userId) ? { _id: userId } : { userId: userId };
        const user = await User.findOne(userFilter);

        if (!user) return res.status(404).json({ message: "User Not Found" });

        const authorizedRoles = ["Admin", "Creator"];

        if (!authorizedRoles.includes(user.accountType)) return res.status(403).json({ message: "Access Denied. User Does Not Have Permitted Account Type" });

        next();
    } 
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});