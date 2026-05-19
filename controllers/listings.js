const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const ExpressError = require("../utils/ExpressError.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;

const getGeometryFromLocation = async (location) => {
  if (!geocodingClient) {
    throw new ExpressError(500, "Mapbox token is not configured.");
  }

  const response = await geocodingClient.forwardGeocode({
    query: location,
    limit: 1
  }).send();

  const [feature] = response.body.features || [];
  if (!feature) {
    throw new ExpressError(400, "Please provide a valid location.");
  }

  return feature.geometry;
};


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const listingData = req.body.listing;
  const geometry = await getGeometryFromLocation(listingData.location);

  const listing = new Listing({
    title: listingData.title,
    description: listingData.description,
    price: listingData.price,
    location: listingData.location,
    country: listingData.country,
    owner: req.user._id,
    geometry,
  });

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  } else if (typeof listingData.image === "string" && listingData.image.trim() !== "") {
    listing.image = { url: listingData.image.trim(), filename: "user-provided-image" };
  }

  await listing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }
  let originalImageUrl= listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  let updatedListing = req.body.listing;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }

  const previousLocation = listing.location;
  listing.title = updatedListing.title;
  listing.description = updatedListing.description;
  listing.price = updatedListing.price;
  listing.location = updatedListing.location;
  listing.country = updatedListing.country;

  if (listing.location !== previousLocation) {
    listing.geometry = await getGeometryFromLocation(listing.location);
  }

  if(typeof req.file !=="undefined"){
    listing.image = {url: req.file.path, filename: req.file.filename};
  } else if (typeof updatedListing.image === "string" && updatedListing.image.trim() !== "") {
    listing.image = {
      url: updatedListing.image.trim(),
      filename: listing.image?.filename || "user-provided-image"
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};