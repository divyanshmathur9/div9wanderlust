const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  sourceKey: {
      type: String,
      unique: true,
      sparse: true,
  },
  title: {
      type: String,
      required: true,
  },
  description: {
      type: String,
      required: true,
  },
  image: {
      url: {
          type: String,
          default: "https://via.placeholder.com/800"  // Default image if missing
      },
      filename: {
          type: String,
          default: "default-image"
      }
  },
  price: Number,
  location: String,
  country: String,
  category: {
      type: String,
      enum: ["trending", "beach", "mountains", "cities", "unique"],
      default: "trending",
      index: true,
  },
  amenities: {
      type: [String],
      default: [],
  },
  maxGuests: {
      type: Number,
      min: 1,
      default: 2,
  },
  reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: "Review",
      },
  ],
  owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }

});

listingSchema.index({ title: "text", description: "text", location: "text", country: "text" });
listingSchema.index({ category: 1, price: 1 });

// Middleware to delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
