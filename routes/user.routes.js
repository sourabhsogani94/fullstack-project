const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getProfile);

router.post("/user", userController.createUser);
router.get("/users", userController.getUsers);
router.put("/user/:id", authMiddleware, userController.updateUser);
router.delete("/user/:id", authMiddleware, userController.deleteUser);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post("/change-password", authMiddleware, userController.changePassword);

module.exports = router;