const Food = require('../models/Food');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
exports.getFoods = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back to JSON
    const parsedQuery = JSON.parse(queryStr);
    
    // Search by name or category
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      parsedQuery.$or = [
        { title: searchRegex },
        { category: searchRegex }
      ];
    }

    // Finding resource
    query = Food.find(parsedQuery).populate({
      path: 'restaurant',
      select: 'name address deliveryTime'
    });

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Executing query
    const foods = await query;

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food
// @route   GET /api/foods/:id
// @access  Public
exports.getFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate({
      path: 'restaurant',
      select: 'name address deliveryTime'
    });

    if (!food) {
      return res.status(404).json({ success: false, error: 'Food not found' });
    }

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new food
// @route   POST /api/foods
// @access  Private/Admin
exports.createFood = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path.replace(/\\/g, '/'); // Normalize path
    }

    const food = await Food.create(req.body);

    res.status(201).json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Private/Admin
exports.updateFood = async (req, res, next) => {
  try {
    let food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, error: 'Food not found' });
    }
    
    if (req.file) {
      req.body.image = req.file.path.replace(/\\/g, '/');
    }

    food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Private/Admin
exports.deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, error: 'Food not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
