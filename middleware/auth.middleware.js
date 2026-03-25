const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("No token");
    }

    try {
        // 🔥 Extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).send("Invalid token format");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        req.role = decoded.role; // 👈 important for role-based access

        next();
    } catch (err) {
        res.status(401).send("Invalid token");
    }
}

module.exports = authMiddleware;