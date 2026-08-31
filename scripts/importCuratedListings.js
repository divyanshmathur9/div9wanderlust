if (process.env.NODE_ENV !== "production") require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const listings = require("./curatedListings");

async function importListings() {
  const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
  const username = process.env.IMPORT_OWNER_USERNAME;
  if (!username) throw new Error("Set IMPORT_OWNER_USERNAME to an existing Wanderlust username before importing.");
  await mongoose.connect(dbUrl);
  const owner = await User.findOne({ username });
  if (!owner) throw new Error(`No Wanderlust user found with username “${username}”.`);
  const operations = listings.map((listing) => ({ updateOne: { filter: { sourceKey: listing.sourceKey }, update: { $setOnInsert: { ...listing, owner: owner._id } }, upsert: true } }));
  const result = await Listing.bulkWrite(operations, { ordered: false });
  console.log(`Curated listings ready: ${result.upsertedCount} added, ${listings.length - result.upsertedCount} already existed.`);
}

importListings().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => mongoose.connection.close());
