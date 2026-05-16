const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: __dirname + '/../.env' });

// Load models
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    name: 'Admin User',
    email: 'admin@yumzy.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Customer 1',
    email: 'customer@yumzy.com',
    password: 'password123',
    role: 'customer'
  }
];

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Food.deleteMany();

    // Create users (using loop to trigger pre-save hook)
    const createdUsers = [];
    for(let user of users) {
        createdUsers.push(await User.create(user));
    }

    const restaurants = await Restaurant.create([
      {
        name: 'Burger King',
        address: '123 Main St, NY',
        cuisine: ['Fast Food', 'American'],
        deliveryTime: '30-45 mins',
        rating: 4.5
      },
      {
        name: 'Sushi Zen',
        address: '456 Sushi Ave, NY',
        cuisine: ['Japanese', 'Sushi'],
        deliveryTime: '45-60 mins',
        rating: 4.8
      }
    ]);

    await Food.create([
      {
        title: 'Whopper',
        description: 'A huge burger with double patty',
        category: 'Burger',
        price: 8.99,
        restaurant: restaurants[0]._id
      },
      {
        title: 'Dragon Roll',
        description: 'Eel and cucumber roll topped with avocado',
        category: 'Sushi',
        price: 15.99,
        restaurant: restaurants[1]._id
      }
    ]);

    console.log('Data Imported...');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Food.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Use node utils/seeder.js -i to import, -d to destroy');
  process.exit(0);
}
