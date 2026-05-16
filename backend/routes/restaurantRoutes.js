const express = require('express');
const {
  getRestaurants,
  createRestaurant,
  updateRestaurant
} = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router
  .route('/')
  .get(getRestaurants)
  .post(protect, authorize('admin'), upload.single('image'), createRestaurant);

router
  .route('/:id')
  .put(protect, authorize('admin'), upload.single('image'), updateRestaurant);

module.exports = router;
