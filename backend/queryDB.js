const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

const Food = require('./models/Food');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const foods = await Food.find({});
    console.log("Foods count:", foods.length);
    if(foods.length > 0) {
        console.log("First food:", JSON.stringify(foods[0], null, 2));
    }
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
