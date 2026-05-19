const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview=async(req, res)=>{
  
    let listing =await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.destroyReview=async(req, res) => {
    let { id, reviewId }= req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  };