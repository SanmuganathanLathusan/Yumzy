const Order = require('../models/Order');
const Cart = require('../models/Cart');
const foodPricing = require('../utils/foodPricing');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, deliveryAddress } = req.body;

    // Get user cart (no need to populate food since it's a String now)
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in cart' });
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItems = cart.items.map(item => {
      const price = foodPricing[item.food] || 0;
      totalPrice += price * item.quantity;
      
      return {
        food: item.food,
        quantity: item.quantity,
        price: price
      };
    });

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      paymentMethod,
      deliveryAddress: deliveryAddress || req.user.address
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Delivery
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    
    // Also update payment status if delivered and COD
    if (orderStatus === 'delivered' && order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = 'completed';
    }
    
    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Make sure the order belongs to the user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation if order is pending
    if (order.orderStatus !== 'pending') {
      return res.status(400).json({ success: false, error: `Cannot cancel order since it is already ${order.orderStatus}` });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
