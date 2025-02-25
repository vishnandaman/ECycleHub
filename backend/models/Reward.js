const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  brand: { type: String, required: true }, // e.g., "Apple"
  name: { type: String, required: true }, // e.g., "iPhone 15 Discount"
  description: { type: String, required: true }, // e.g., "Get ₹10,000 off on iPhone 15."
  eCoinsRequired: { type: Number, required: true }, // e.g., 500 E-Coins
  imageUrl: { type: String, required: true }, // Product image URL
  logoUrl: { type: String, required: true } // Company logo URL
});

const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;
