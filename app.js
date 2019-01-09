//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const items = [];
const works = [];


app.get("/", function(req, res){
    res.render("list", {listTitle: Today, listItems: items});

});

app.post("/", function (req, res) {
    let item = req.body.newItem;
    if (req.body.list === "Work"){
        works.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }

});

app.get("/work", function (req, res) {
   res.render("list", {listTitle: "Work", listItems: works});
});

app.post("/work", function (req, res) {
    res.redirect("/work");
});


app.get("/about", function (req, res) {
   res.render("about");
});
app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
