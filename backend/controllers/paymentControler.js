// controllers/paymentController.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: "Amount and currency required" });
    }

    // Stripe expects amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      metadata: { orderId }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify Payment Status
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      status: paymentIntent.status
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
