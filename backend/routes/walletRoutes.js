const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get user E-Coins balance
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ eCoins: user.eCoins });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch E-Coins balance" });
  }
});

module.exports = router;
