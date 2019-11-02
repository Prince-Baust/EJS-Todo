//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Succesfully added");
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", listItems: foundItems})
        }
    });
});
app.get("/:customListName", function (req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", {listTitle: foundList.name, listItems: foundList.items});
            }
        }
    });


});


app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const itemN = new Item({
        name: itemName
    });

    if (listName === "Today") {
        itemN.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function (err, foundList) {
            foundList.items.push(itemN);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (req.body.listItems === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Successfully deleted item having id: " + checkedItemId);
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function (err, foundList) {
            if (!err)
                res.redirect("/" + listName);
        });
    }


});


app.get("/about", function (req, res) {
    res.render("about");
});
app.listen(3000, function () {
    console.log("Server started on port 3000.");
});