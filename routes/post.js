//Import libraries
const express = require("express");

//Import models
const post_model = require("./../models/post");
const user_model = require("./../models/user");
const comment_model = require("./../models/comment");

//Create Router
const router = express.Router();

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

//Get the create post page
router.get("/new", get_username, (req, res) =>{
    res.render("create_post", {username: req.username});
});

//Get the page of a post
router.get("/:id", get_username, async (req, res) => {
    const post_id = req.params.id;

    try{
        //find the post and redirect to home page if does not exist
        let my_post = await post_model.findById(post_id);

        if(my_post == null){
            res.redirect("/");
        }

        //array with all the comments associated with the post
        let all_comments = [];
        for (let i = 0; i < my_post.comments.length; i++){
            let my_comment = await comment_model.findById(my_post.comments[i]);
            all_comments.push(my_comment);
        }

        res.render("single_post", {post: my_post, username: req.username, comments: all_comments});
    }
    catch(err){console.log(err);}
});

//Recieve information for new post
router.post("/", get_username, async(req, res) => {
    let post = new post_model({
        title: req.body.title,
        body: req.body.body,
        user: req.username
    });
    
    //save the post to database, and redirect to the page of specfic post
    try{
        post = await post.save();
        res.redirect(`post/${post.id}`);
    }
    catch(err){
        console.log(err);
        res.render("create_post");
    }
});

//Handle delete route for a single post
router.delete("/:id", async (req, res) => {

    //find the post and delete all the comments
    try{
        let post = await post_model.findById(req.params.id);

        for(let i = 0; i < post.comments.length; i++){
            await comment_model.findByIdAndDelete(post.comments[i]);
        }

        //delete the post and redirect to homepage
        await post_model.deleteOne({_id: req.params.id});
        res.redirect("/");
    }
    catch(err){console.log(err);}
});

//Add a new comment to a post
router.post("/:id/comment", get_username, async (req, res) =>{
    let comment = new comment_model({
        username: req.username,
        body: req.body.comment
    });

    //add the comment to the post model, redirect back to specific post page
    try{
        let post = await post_model.findById(req.params.id);
        post.comments.push(comment);
        await comment.save();
        await post.save();
        res.redirect(`/post/${req.params.id}`);
    }
    catch(err){console.log(err);}
});

//Display the edit page for a post
router.get("/edit/:id", get_username, async(req, res) => {
    try{
        const post = await post_model.findById(req.params.id);

        //only owners of the post can edit, redirect to sepecific post page if not owner
        if(post.user !== req.username){
            res.redirect(`/post/${req.params.id}`);
        }

        //render edit page
        else{res.render("edit", {post, username: req.username});}
    }
    catch(err){console.log(err);}
});

//Handle editing a post
router.patch("/edit/:id", async (req, res) =>{
    //Find the post and update the body
    try{
        let post = await post_model.findByIdAndUpdate(req.params.id, {body: req.body.body});
        res.redirect(`/post/${req.params.id}`);
    }
    catch(err){console.log(err);}
});

module.exports = router;