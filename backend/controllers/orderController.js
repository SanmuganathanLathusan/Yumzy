const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { paymentMethod, deliveryAddress } = req.body;

    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.food');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in cart' });
    }

    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItems = cart.items.map(item => {
      const price = item.food.price;
      totalPrice += price * item.quantity;
      
      return {
        food: item.food._id,
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
    const orders = await Order.find({ user: req.user.id }).populate('items.food', 'title image price');

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
    const orders = await Order.find().populate('user', 'name email').populate('items.food', 'title');

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
