const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            { userId: user._id },
            process.env.JWT_SECRET
        );

        res.json({ token });
    } catch (err) {
        res.status(500).send("Error in login");
    }
};

exports.getProfile = async function(req, res) {
    const user = await User.findById(req.userId);
    res.json(user);
};

exports.createUser = async function(req, res) {
    const user = new User(req.body);

    await user.save();

    res.send("User saved in database");
};

exports.getUsers = async function(req, res) {
    const users = await User.find();
    res.json(users);
};

exports.updateUser = async function(req, res) {
    const id = req.params.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(user);
};

exports.deleteUser = async function(req, res) {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.send("User deleted successfully");
};