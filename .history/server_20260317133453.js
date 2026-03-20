const express = require("express");
const app = express();

app.get("/", function(req, res){
    res.send("My First Server 🚀");
});

app.get("/about", function(req, res){
    res.send("This is About Page");
});
app.listen(3000, function(){
    console.log("Server started on port 3000");
});

