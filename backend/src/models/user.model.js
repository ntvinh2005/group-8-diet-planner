import mongoose from "mongoose";

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
        // Add Possible Subscription Permisisons ??
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;