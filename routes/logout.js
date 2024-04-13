const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.session.user_id = null;
    res.redirect("/logout");
});

module.exports = router;