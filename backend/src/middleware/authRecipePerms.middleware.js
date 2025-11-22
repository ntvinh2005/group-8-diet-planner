import User from "../models/user.model";
import asyncHandler from "express-async-handler";

export const authorizeRecipePerms = asyncHandler( async (req, res, next) => {
    try {
        const { userID } = req.body;

        if (!userID) return res.status(400).json({ message: "User Id Is Required" });

        const user = await User.findOne({ userId: userID });

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