const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
  guest: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  nights: { type: Number, required: true, min: 1 },
  nightlyPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed", index: true },
}, { timestamps: true });

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ guest: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
