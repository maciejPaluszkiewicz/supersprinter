let express = require("express");
    mustache = require("mustache");
    bodyParser = require("body-parser");

let helpers = require("./helpers.js");

let app = express();

app.use(express.static("html"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get("/list", function(req, res) {
    let data = helpers.load_data();
    let template = helpers.load_template("userStoriesTable.html");
    res.end(mustache.render(template, data));
});

app.get("/add", function(req, res) {
    let template = helpers.load_template("addUserStory.html");
    res.end(mustache.render(template, {} ));
});

app.post("/add", function(req, res) {
    if(helpers.validate(req.body)){
        helpers.add_story(req.body);
        res.redirect("/list");
    } else {
        let model = {data:req.body, error:true}
        let template = helpers.load_template("addUserStory.html");
        res.end(mustache.render(template, model));
    }
});

app.get("/edit/:id", function(req, res) {
    let template = helpers.load_template("addUserStory.html");
    let model = {data: helpers.load_single_story(req.params.id)};
    res.end(mustache.render(template, model));
});

app.post("/edit", function(req, res) {
    if(helpers.validate(req.body)){
        helpers.edit_story(req.body);
        res.redirect("/list");
    } else {
        let model = {data:req.body, error:true}
        let template = helpers.load_template("addUserStory.html");
        res.end(mustache.render(template, model));
    }
});

app.listen(8080);