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

const item1 = new Item({
    name: "This is a todo list"
});

const item2 = new Item({
    name: "Hit like"
});
const item3 = new Item({
    name: "Thanks"
});

const defaultItems = [item1, item2, item3];

const works = [];


app.get("/", function(req, res){

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0){
            Item.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Succesfully added");
            });
            res.redirect("/");
        } else{
            res.render("list", {listTitle: "Today", listItems: foundItems})
        }
    });
});





app.post("/", function (req, res) {
    const itemName = req.body.newItem;

    const itemN = new Item({
        name: itemName
    });

    itemN.save();

    res.redirect("/");

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
