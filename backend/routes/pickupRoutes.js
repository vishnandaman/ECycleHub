const express = require("express");
const router = express.Router();

// Simulated database (Make sure this is exported)
const pickups = [];

router.post("/schedule-pickup", (req, res) => {
  const { category, weight, condition, pickupDate, pickupTime } = req.body;

  if (!category || !weight || !condition || !pickupDate || !pickupTime) {
    return res.status(400).json({ success: false, message: "All fields are required!" });
  }

  const trackingId = `EWH-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPickup = { trackingId, category, weight, condition, pickupDate, pickupTime, status: "Scheduled" };

  pickups.push(newPickup);

  res.status(201).json({ success: true, trackingId });
});

module.exports =router;
module.exports.pickups=pickups;
