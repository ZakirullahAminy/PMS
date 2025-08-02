const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  downloadUrl: String,
  readUrl: String,
});

module.exports = mongoose.model("Card", CardSchema);
