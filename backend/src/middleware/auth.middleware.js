import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const protectRoute = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "Access Denied, No Token Provided"} );

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch(err) {
    console.error("Authentication Error:", err.message);
    return res.status(401).json({ message: "Invalid or Expired Token." });
  }
};
