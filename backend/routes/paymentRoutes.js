// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  verifyPayment
} = require("../controllers/paymentController");

// Create payment
router.post("/create", createPaymentIntent);

// Verify payment (optional)
router.post("/verify", verifyPayment);

module.exports = router;
