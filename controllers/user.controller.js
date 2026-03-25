const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================
exports.signup = async function (req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        if (password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.send("User registered successfully");
    } catch (err) {
        res.status(500).send("Error in signup");
    }
};


// ================= LOGIN =================
exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Wrong password");
        }

       const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET
);

        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).send("Error in login");
    }
};


// ================= PROFILE =================
exports.getProfile = async function (req, res) {
    try {
        const user = await User.findById(req.userId).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).send("Error getting profile");
    }
};


// ================= CREATE USER =================
exports.createUser = async function(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("All fields required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user" // default user
        });

        await user.save();

        res.send("User created successfully");
    } catch (err) {
        res.status(500).send("Error creating user");
    }
};


// ================= GET ALL USERS =================
exports.getUsers = async function(req, res) {
    try {
        let { page = 1, limit = 5, search = '' } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        res.status(500).send("Error fetching users");
    }
};


// ================= UPDATE USER (ADMIN TYPE) =================
exports.updateUser = async function (req, res) {
    try {
        const id = req.params.id;
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        ).select("-password");

        res.json(user);
    } catch (err) {
        res.status(500).send("Error updating user");
    }
};


// ================= DELETE USER =================
exports.deleteUser = async function(req, res) {
    const id = req.params.id;

    if (req.userId === id) {
        return res.status(400).send("You cannot delete yourself");
    }

    await User.findByIdAndDelete(id);

    res.send("User deleted successfully");
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async function (req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).send("Name and email required");
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, email },
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).send("Error updating profile");
    }
};


// ================= MAKE ADMIN =================
exports.makeAdmin = async function (req, res) {
    try {
        const user = await User.findByIdAndUpdate(
            req.userId,
            { role: 'admin' },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json({ message: "You are now an admin", user });
    } catch (err) {
        res.status(500).send("Error making admin");
    }
};


// ================= CHANGE PASSWORD =================
exports.changePassword = async function (req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send("Both passwords required");
        }

        if (newPassword.length < 6) {
            return res.status(400).send("New password must be at least 6 characters");
        }

        const user = await User.findById(req.userId);

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).send("Old password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.send("Password updated successfully");

    } catch (err) {
        res.status(500).send("Error changing password");
    }
};