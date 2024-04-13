//Import libraries
const express = require("express");

//Create router
const router = express.Router();

//Delete user session and direct to log in page
router.get("/", (req, res) => {
    req.session.user_id = null;
    res.redirect("/login");
});

module.exports = router;