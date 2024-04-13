//Import libraries
const express = require("express");
const user_model = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("register");
});

router.post("/", async (req, res) =>{
    try{
        const new_password = await bcrypt.hash(req.body.password, 10);
        let user = new user_model({
        username: req.body.username,
        password: new_password
        });
        user = await user.save();
        req.session.user_id = user._id;
        res.redirect("/", );
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;