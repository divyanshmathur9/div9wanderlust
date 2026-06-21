const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj, owner:"683f14c60ebc1f0ad89d28f6"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};
const seedData = async () => {
  try {
    await connectDB();
    console.log("connected to DB");
    await initDB();
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
  }
};

seedData();
