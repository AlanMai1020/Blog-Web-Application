const express = require("express");
const router = express.Router();
const user_model = require("./../models/user");
const post_model = require("./../models/post");

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

router.get("/", get_username, async(req,res) =>{
    try{
        const post = await post_model.find({title: req.query.term});
        const user = await user_model.find({username: req.query.term});
        res.render("search", {username: req.username, post, user});
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;