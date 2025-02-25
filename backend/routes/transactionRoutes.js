const express = require("express");
const Voucher = require("../models/Voucher");

const router = express.Router();

// Get user transaction history
router.get("/:userId", async (req, res) => {
  try {
    const vouchers = await Voucher.find({ userId: req.params.userId }).populate("rewardId");
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

module.exports = router;
