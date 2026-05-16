const express = require('express');
const {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getOrders); // Returns user's orders

router.get('/all', authorize('admin'), getAllOrders);

router.put('/:id/status', authorize('admin', 'delivery'), updateOrderStatus);

module.exports = router;
