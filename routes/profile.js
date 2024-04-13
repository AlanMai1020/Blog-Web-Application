const express = require("express");
const router = express.Router();
const post_model = require("./../models/post");
const user_model = require("./../models/user");
const comment_model = require("./../models/comment");

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

router.get("/:username", get_username, async (req, res) =>{
    const post = await post_model.find({user: req.params.username});
    const comment = await comment_model.find({username: req.params.username});
    res.render("profile", {username: req.username, post, comment, profile_user: req.params.username});
});

module.exports = router;