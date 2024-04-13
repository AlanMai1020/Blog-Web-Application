//import libraries
const express = require("express");

//create router
const router = express.Router();

//import models
const user_model = require("./../models/user");
const post_model = require("./../models/post");

//Middleware to get the username from user session id
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

//handle the route for the search bar
router.get("/", get_username, async(req,res) =>{

    //search for any posts or users that match the query
    try{
        const post = await post_model.find({title: req.query.term});
        const user = await user_model.find({username: req.query.term});
        res.render("search", {username: req.username, post, user});
    }
    catch(err){console.log(err);}
});

module.exports = router;