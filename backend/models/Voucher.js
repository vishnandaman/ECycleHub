const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  rewardId: mongoose.Schema.Types.ObjectId,
  voucherCode: String,
  redeemedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Voucher", voucherSchema);
