const express = require("express");
const Reward = require("../models/Reward");

const router = express.Router();

// ✅ Fetch all rewards
router.get("/rewards", async (req, res) => {
  try {
    const rewards = await Reward.find();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rewards" });
  }
});

// ✅ Add a new reward (For Admin Use)
router.post("/rewards", async (req, res) => {
  try {
    const { brand, name, description, eCoinsRequired, imageUrl, logoUrl } = req.body;

    const newReward = new Reward({
      brand,
      name,
      description,
      eCoinsRequired,
      imageUrl,
      logoUrl
    });

    await newReward.save();
    res.status(201).json({ message: "Reward added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error adding reward" });
  }
});

module.exports = router;
