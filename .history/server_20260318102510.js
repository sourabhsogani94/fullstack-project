const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// CONNECT DATABASE
mongoose.connect("mongodb+srv://sourabhsogani94_db_user:test123@cluster0.de1mlyt.mongodb.net/mydatabase?retryWrites=true&w=majority")
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// SCHEMA
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});


// MODEL
const User = mongoose.model("User", userSchema);

const bcrypt = require("bcrypt");

app.post("/signup", async function(req, res){

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword
    });

    await user.save();

    res.send("User registered successfully");
});

const jwt = require("jsonwebtoken");

app.post("/login", async function(req, res){

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user){
        return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        return res.send("Wrong password");
    }

    const token = jwt.sign(
        { userId: user._id },
        "secretkey"
    );

    res.json({ token });
});

// POST API
app.post("/user", async function(req, res){

    const user = new User(req.body);

    await user.save();

    res.send("User saved in database");
});

// GET API
app.get("/users", async function(req, res){

    const users = await User.find();

    res.json(users);
});

app.put("/user/:id", async function(req, res){

    const id = req.params.id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(user);
});

app.delete("/user/:id", async function(req, res){

    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.send("User deleted successfully");
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
});