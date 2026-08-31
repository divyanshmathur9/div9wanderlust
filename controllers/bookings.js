const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { normalizeBookingInput, overlapFilter } = require("../utils/booking");

module.exports.create = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) { req.flash("error", "That listing is no longer available."); return res.redirect("/listings"); }
  if (listing.owner?.equals(req.user._id)) { req.flash("error", "Hosts cannot reserve their own listing."); return res.redirect(`/listings/${listing._id}`); }
  const bookingData = normalizeBookingInput(req.body.booking, listing.maxGuests || 2);
  if (bookingData.error) { req.flash("error", bookingData.error); return res.redirect(`/listings/${listing._id}`); }
  const conflict = await Booking.exists(overlapFilter(listing._id, bookingData.checkIn, bookingData.checkOut));
  if (conflict) { req.flash("error", "Those dates are already reserved. Please choose another stay."); return res.redirect(`/listings/${listing._id}`); }
  await Booking.create({ listing: listing._id, guest: req.user._id, ...bookingData, nightlyPrice: listing.price, totalPrice: listing.price * bookingData.nights });
  req.flash("success", "Your reservation is confirmed.");
  res.redirect("/dashboard#trips");
};

module.exports.cancel = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.bookingId, guest: req.user._id });
  if (!booking) { req.flash("error", "Reservation not found."); return res.redirect("/dashboard"); }
  if (booking.status === "cancelled") { req.flash("error", "This reservation is already cancelled."); return res.redirect("/dashboard"); }
  booking.status = "cancelled";
  await booking.save();
  req.flash("success", "Reservation cancelled.");
  res.redirect("/dashboard#trips");
};
