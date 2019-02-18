var express =require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// roor route
router.get("/",function(req,res){
    res.render("landing");
});

// AUTH ROUTES

//register
router.get("/register",function(req,res){
    res.render("register", {page: 'register'});
});

router.post("/register", function(req, res) {
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if(err){
    console.log(err);
    return res.render("register", {error: err.message});
}
    passport.authenticate("local")(req,res,function() {
        req.flash("sucsess", "Welcome to YelpCamp " + user.username);
        res.redirect("/campgrounds");
    });
  });
});

//login
router.get("/login",function(req,res){
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res){
});

//logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("sucsess", "Logged you out!");
   res.redirect("/campgrounds");
});

module.exports = router;