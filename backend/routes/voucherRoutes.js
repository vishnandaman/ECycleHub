const express = require("express");
const Voucher = require("../models/Voucher");
const User = require("../models/User");
const Reward = require("../models/Reward");

const router = express.Router();

// Redeem E-Coins for a voucher
router.post("/redeem", async (req, res) => {
  const { userId, rewardId } = req.body;

  try {
    const user = await User.findById(userId);
    const reward = await Reward.findById(rewardId);

    if (!user || !reward) return res.status(404).json({ error: "Invalid data" });
    if (user.eCoins < reward.eCoinsRequired) return res.status(400).json({ error: "Not enough E-Coins" });

    user.eCoins -= reward.eCoinsRequired;
    await user.save();

    const voucher = new Voucher({
      userId,
      rewardId,
      voucherCode: `ECOINS-${Math.random().toString(36).substring(7).toUpperCase()}`,
    });

    await voucher.save();
    res.json({ message: "Voucher redeemed!", voucherCode: voucher.voucherCode });
  } catch (err) {
    res.status(500).json({ error: "Redemption failed" });
  }
});

module.exports = router;
