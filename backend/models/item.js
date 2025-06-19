const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: String,
  price: Number,
});

module.exports = mongoose.model("Item", itemSchema);
