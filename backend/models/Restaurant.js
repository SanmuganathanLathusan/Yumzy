const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  cuisine: {
    type: [String],
    required: true
  },
  deliveryTime: {
    type: String, // e.g., '30-45 mins'
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
