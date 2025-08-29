const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/nft");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const NFTItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  price: String,
  creator: String,
  NFTAddress: String,
});

const NFTList = mongoose.model("NFTList", NFTItemSchema);

module.exports = NFTList;
