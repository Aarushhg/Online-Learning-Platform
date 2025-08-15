const express = require('express');
const Razorpay = require('razorpay');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_GTJMRW7eJdFppG',
  key_secret: 'odARQxIzLZ3zKsE9u0N6jyYA'
});

// Route to create order
router.post('/create-order', authenticate, async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
