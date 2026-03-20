const express = require("express");
const app = express();

// IMPORTANT (we explain below)
app.use(express.json());

app.get("/", function(req, res){
    res.send("Home Page");
});

// NEW API
app.post("/user", function(req, res){

    const user = req.body;

    console.log(user);

    res.send("User received successfully");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});