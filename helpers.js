
exports.version = "0.1.0";
const fs = require("fs");

exports.load_data = function (){
    let rawdata = fs.readFileSync("./data/userStories.js");
    let userStories = JSON.parse(rawdata);
    return userStories;
}

exports.load_single_story = function (id) {
    let currentStories = exports.load_data();
    return currentStories.stories.find(x => x.id == id);
}

exports.write_data = function (userStories){
    let rawdata = JSON.stringify(userStories, null, 2);
    fs.writeFileSync("./data/userStories.js", rawdata);
}

exports.load_template = function(templateName){
    return fs.readFileSync("./html/" + templateName, "utf8");
}

exports.add_story = function (reqBody) {
    reqBody.id = Date.now()
    let currentUserStories = exports.load_data();
    currentUserStories.stories.push(reqBody);
    exports.write_data(currentUserStories);
}

exports.edit_story = function (reqBody) {
    reqBody.id = parseInt(reqBody.id);
    let currentUserStories = exports.load_data();
    let objIndex = currentUserStories.stories.findIndex((obj => obj.id == reqBody.id));
    currentUserStories.stories[objIndex] = reqBody;
    exports.write_data(currentUserStories);
}

exports.validate = function (reqBody) {
    if(!reqBody.story_title) return false;
    if(reqBody.story_title.length < 5) return false;
    if(reqBody.story_title.includes("\n")) return false;
    
    if(!reqBody.user_story) return false;

    if(!reqBody.acceptance_criteria) return false;

    if(reqBody.business_value){
        if(reqBody.business_value.includes("\n")) return false;
        if(reqBody.business_value < 100) return false;
        if(reqBody.business_value > 1500) return false;
        if(reqBody.business_value%100 != 0) return false;
    }

    if(reqBody.estimation) {
        if(reqBody.estimation.includes("\n")) return false;
        if(reqBody.estimation < 0.5) return false;
        if(reqBody.estimation > 40) return false;
        if((reqBody.estimation*10)%5 != 0) return false;
    }
    return true;
}
