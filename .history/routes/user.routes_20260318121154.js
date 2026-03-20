const express = require("express");
const router = express.Router();

const { signup, login, getProfile, createUser, getUsers, updateUser, deleteUser } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

router.post("/user", createUser);
router.get("/users", getUsers);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

module.exports = router;