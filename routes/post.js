//Import libraries
const express = require("express");
const post_model = require("./../models/post");
const user_model = require("./../models/user");
const comment_model = require("./../models/comment");
const router = express.Router();

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

router.get("/new", get_username, (req, res) =>{
    res.render("create_post", {username: req.username});
});

router.get("/:id", get_username, async (req, res) => {
    const post_id = req.params.id;
    try{
        let my_post = await post_model.findById(post_id);
        if(my_post == null){
            res.redirect("/");
        }
        let all_comments = [];
        for (let i = 0; i < my_post.comments.length; i++){
            let my_comment = await comment_model.findById(my_post.comments[i]);
            all_comments.push(my_comment);
        }
        res.render("single_post", {post: my_post, username: req.username, comments: all_comments});
    }
    catch(err){
        console.log(err);
    }
});

router.post("/", get_username, async(req, res) => {
    let post = new post_model({
        title: req.body.title,
        body: req.body.body,
        user: req.username
    });
    
    try{
        post = await post.save();
        res.redirect(`post/${post.id}`);
    }
    catch(err){
        console.log(err);
        res.render("create_post");
    }
});

router.delete("/:id", async (req, res) => {
    try{
        let post = await post_model.findById(req.params.id);
        for(let i = 0; i < post.comments.length; i++){
            await comment_model.findByIdAndDelete(post.comments[i]);
        }
        await post_model.deleteOne({_id: req.params.id});
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});

router.post("/:id/comment", get_username, async (req, res) =>{
    let comment = new comment_model({
        username: req.username,
        body: req.body.comment
    });

    try{
        let post = await post_model.findById(req.params.id);
        post.comments.push(comment);
        await comment.save();
        await post.save();
        res.redirect(`/post/${req.params.id}`);
    }
    catch(err){console.log(err);}
});

router.get("/edit/:id", get_username, async(req, res) => {
    try{
        const post = await post_model.findById(req.params.id);
        if(post.user !== req.username){
            res.redirect(`/post/${req.params.id}`);
        }
        else{res.render("edit", {post, username: req.username});}
    }
    catch(err){console.log(err);
    }
});

router.patch("/edit/:id", async (req, res) =>{
    try{
        let post = await post_model.findByIdAndUpdate(req.params.id, {body: req.body.body});
        res.redirect(`/post/${req.params.id}`);
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;