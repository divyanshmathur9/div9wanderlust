const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

module.exports.renderSignupForm=(req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req, res, next)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=  new User({email,username});
    const registeredUser= await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    });
   
 }catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
 }

};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res,next)=>{
    req.logout((err)=>{
        if(err){
         return next(err);
        }
        req.flash("success", "You are logged out now!");
        res.redirect("/listings");
    });
};

module.exports.dashboard = async (req, res) => {
    const [ownedListings, bookings, user] = await Promise.all([
        Listing.find({ owner: req.user._id }).sort({ _id: -1 }).lean(),
        Booking.find({ guest: req.user._id }).populate("listing").sort({ createdAt: -1 }).lean(),
        User.findById(req.user._id).populate("favorites").lean(),
    ]);
    res.render("users/dashboard.ejs", { ownedListings, bookings, favorites: user.favorites || [], isHost: req.user.role === "host" || ownedListings.length > 0 });
};

module.exports.toggleFavorite = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) { req.flash("error", "Listing not found."); return res.redirect("/listings"); }
    const user = await User.findById(req.user._id);
    const index = user.favorites.findIndex((favorite) => favorite.equals(listing._id));
    if (index >= 0) { user.favorites.splice(index, 1); req.flash("success", "Removed from saved stays."); }
    else { user.favorites.push(listing._id); req.flash("success", "Saved for later."); }
    await user.save();
    res.redirect(req.get("referer") || `/listings/${listing._id}`);
};
