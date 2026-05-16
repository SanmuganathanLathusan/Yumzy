const express = require('express');
const {
  getFoods,
  getFood,
  createFood,
  updateFood,
  deleteFood
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router
  .route('/')
  .get(getFoods)
  .post(protect, authorize('admin'), upload.single('image'), createFood);

router
  .route('/:id')
  .get(getFood)
  .put(protect, authorize('admin'), upload.single('image'), updateFood)
  .delete(protect, authorize('admin'), deleteFood);

module.exports = router;
