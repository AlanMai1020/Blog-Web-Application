//Import libraries
const express = require("express");
const bcrypt = require("bcrypt");

//import models
const user_model = require("../models/user");

//create router
const router = express.Router();

//Display register page
router.get("/", (req, res) => {
    res.render("register");
});

//Get user info and add it to the database
router.post("/", async (req, res) =>{
    try{
        //encrypt user's passwords
        const new_password = await bcrypt.hash(req.body.password, 10);

        let user = new user_model({
        username: req.body.username,
        password: new_password
        });

        //save the user with the encrypted passwords and save user session id
        user = await user.save();
        req.session.user_id = user._id;
        res.redirect("/", );
    }
    catch(err){console.log(err);}
});

module.exports = router;