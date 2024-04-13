//Import libraries
const express = require("express");

//create router
const router = express.Router();

//import models
const post_model = require("./../models/post");
const user_model = require("./../models/user");
const comment_model = require("./../models/comment");

//Middleware to get username from user id
async function get_username(req, res, next){
    try{
        let user = await user_model.findById(req.session.user_id);
        req.username = user.username;
        next();
    }
    catch(err){
        console.log(err);
    }
}

//render the user's page with all their posts and comments
router.get("/:username", get_username, async (req, res) =>{
    const post = await post_model.find({user: req.params.username});
    const comment = await comment_model.find({username: req.params.username});
    res.render("profile", {username: req.username, post, comment, profile_user: req.params.username});
});

module.exports = router;