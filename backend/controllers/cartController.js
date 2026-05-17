const Cart = require('../models/Cart');
const Food = require('../models/Food');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ food: foodId, quantity: quantity || 1 }]
      });
    } else {
      // Check if food exists in cart
      const itemIndex = cart.items.findIndex(p => p.food === String(foodId));

      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += (quantity || 1);
      } else {
        // Add new item
        cart.items.push({ food: foodId, quantity: quantity || 1 });
      }
      cart = await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { foodId, quantity } = req.body;

    if (quantity < 1) {
      return exports.removeFromCart(req, res, next);
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(p => p.food === String(foodId));
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      
      res.status(200).json({ success: true, data: cart });
    } else {
      res.status(404).json({ success: false, error: 'Item not in cart' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const foodId = req.params.foodId || req.body.foodId;
    
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.food !== String(foodId));
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};
