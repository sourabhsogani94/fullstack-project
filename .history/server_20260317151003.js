const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// CONNECT DATABASE
mongoose.connect("mongodb+srv://sourabhsogani94_db_user:OpoE0gOgSfiapG6J@cluster0.de1mlyt.mongodb.net/mydatabase?retryWrites=true&w=majority")
.then(() => console.log("Database connected"))
.catch(err => console.log(err));

// SCHEMA
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

// MODEL
const User = mongoose.model("User", userSchema);

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

app.listen(3000, function(){
    console.log("Server started on port 3000");
});