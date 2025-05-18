const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    // console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("ydyyyyyyy", decoded);
        const user = await User.findById(decoded.user.id).select("-password");
        // console.log("users======>", user);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        console.log("req.user=======>", req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = { authMiddleware };
