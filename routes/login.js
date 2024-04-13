//Import libraries
const express = require("express");
const user_model = require("./../models/user");
const bcrypt = require("bcrypt");

//create a router
const router = express.Router();

//Login page
router.get("/", (req, res) => {
    res.render("login");
});

//Get login information
router.post("/", async (req, res) => {
    const {username, password} = req.body;
    const user = await user_model.findOne({username});

    //Redirect back to login if user does not exist
    if(user === null){
        res.redirect("/login");
        return;
    }

    //Check to see if password is correct
    const isValid = await bcrypt.compare(password, user.password);
    if(isValid){
        req.session.user_id = user._id;
        res.redirect("/");
    }

    //redirect back to login if password incorrect
    else{res.redirect("/login");}
});

module.exports = router;