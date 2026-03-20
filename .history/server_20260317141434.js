const express = require("express");
const app = express();

app.use(express.json());

let users = [];

app.get("/", function(req, res){
    res.send("Home Page");
});

// SAVE USER
app.post("/user", function(req, res){

    const user = req.body;

    users.push(user);

    res.send("User saved successfully");
});

// GET USERS
app.get("/users", function(req, res){

    res.json(users);

});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});