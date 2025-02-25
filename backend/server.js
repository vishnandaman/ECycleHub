require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Reward = require("./models/Reward");

// Import existing routes
const pickupRoutes  = require("./routes/pickupRoutes");
const trackingRoutes = require("./routes/trackingRoutes");

// Import new routes for E-Coins redemption
const rewardRoutes = require("./routes/rewardRoutes");
const walletRoutes = require("./routes/walletRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));
// Routes
app.use("/api", pickupRoutes);
app.use("/api", trackingRoutes);
app.use("/api", rewardRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transactions", transactionRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("🚀 E-Cycle Hub Backend is Running");
});
app.post("/predict", (req, res) => {
    console.log("Received request:", req.body); // ✅ Debugging the incoming request
  // Your ML model processing logic
  res.json({ message: "Prediction result" });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
