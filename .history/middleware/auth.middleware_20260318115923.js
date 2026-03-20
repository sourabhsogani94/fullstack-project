const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.send("No token");
    }

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.send("Invalid token");
    }
}

module.exports = authMiddleware;