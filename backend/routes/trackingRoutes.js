const express = require("express");
const router = express.Router();

// Import the pickups array from pickupRoutes.js
const { pickups } = require("./pickupRoutes");

// Get pickup tracking details
router.get("/tracking/:trackingId", (req, res) => {
  const { trackingId } = req.params;
  const pickup = pickups.find((p) => p.trackingId === trackingId);

  if (!pickup) {
    return res.status(404).json({ message: "⚠️ No tracking details found. Please check your tracking ID." });
  }

  res.json(pickup);
});

module.exports = router;
