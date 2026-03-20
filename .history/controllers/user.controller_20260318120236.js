const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async function(req, res) {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.send("User registered successfully");
};

exports.login = async function(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.send("Wrong password");
    }

    const token = jwt.sign(
        { userId: user._id },
        "secretkey"
    );

    res.json({ token });
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