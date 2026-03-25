const User = require("../models/user.model");

async function adminMiddleware(req, res, next) {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
        return res.status(403).send("Access denied");
    }

    next();
}

module.exports = adminMiddleware;