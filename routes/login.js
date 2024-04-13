//Import libraries
const express = require("express");
const user_model = require("./../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", async (req, res) => {
    const {username, password} = req.body;
    const user = await user_model.findOne({username});

    if(user === null){
        res.redirect("/login");
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(isValid){
        req.session.user_id = user._id;
        res.redirect("/");
    }
    else{res.redirect("/login");}
});

module.exports = router;