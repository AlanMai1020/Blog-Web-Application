//Import libraries
const express = require("express");
const mongoose = require("mongoose");
const method_override = require("method-override");
const session = require("express-session");
require("dotenv").config();

//Import Routers
const post_router = require("./routes/post");
const register_router = require("./routes/register");
const login_router = require("./routes/login");
const logout_router = require("./routes/logout");
const search_router = require("./routes/search");
const profile_router = require("./routes/profile");

//Import models
const post_model = require("./models/post");
const user_model = require("./models/user");

//Start server
const app = express();
mongoose.connect(process.env.DB_URL)
    .then((reseult) => {
        console.log("Connected to Database");
        app.listen(3000);
    })
    .catch((err) => {console.log(err)});

//Middleware
app.set("view engine", "ejs");
app.use(express.static("public_files"));
app.use(express.urlencoded({extended: false}));
app.use(method_override("_method"));
app.use(session({secret: "Minigoose", resave: true, saveUninitialized: true}));

//Middleware to check if user has logged in
function authorize(req, res, next){
    if(req.session.user_id){
        next();
    }
    else{
        res.redirect("/login");
    }
}

//Middleware to get the username from user session id
async function get_username(req, res, next){
    try{
        let user = await user_model.findById(req.session.user_id);
        req.username = user.username;
        next();
    }
    catch(err){
        req.username = "Sign in";
        next();
    }
}

//Routes that do not require authorization
app.use("/register", register_router);
app.use("/login", login_router);
app.get("/", get_username, async(req, res) => {
    const posts = await post_model.find().sort({date: "desc"});
    res.render("index.ejs", {posts, username: req.username});
});

//Routes that do require authorization
app.use(authorize);
app.use("/post", post_router);
app.use("/search", search_router);
app.use("/profile", profile_router);
app.use("/logout", logout_router);
