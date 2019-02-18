var express =require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({}, function(err,allCampgrounds){
    if (err){
        console.log(err);
    } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'});
    }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description:desc, author:author};
    Campground.create(newCampground, function(err,CreatedCampground){
    if (err){
        console.log(err);
    } else {
        res.redirect("/campgrounds");
    }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
    if (err || !foundCampground){
        req.flash("err", "Campground not found");
        res.redirect("back");
    } else {
        res.render("campgrounds/show", {campground: foundCampground});
    }
    });
});

//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            req.flash("error", "Campground not found");
            res.render("campgrounds");
        } else {
            req.flash("sucsess", "New info saved");
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           req.flash("sucsess", "Campground updated");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY ROUTE

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/campgrounds");
       } else {
           req.flash("sucsess", "Campground deleted");
           res.redirect("/campgrounds");
       }
   }); 
});

module.exports = router;