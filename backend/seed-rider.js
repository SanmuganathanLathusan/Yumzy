require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Inline minimal schema to avoid model conflicts
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'customer' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const RIDER = {
  name: 'Raj Rider',
  email: 'rider@yumzy.com',
  password: 'rider123',
  role: 'delivery'
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if rider already exists
    const existing = await User.findOne({ email: RIDER.email });
    if (existing) {
      console.log(`⚠️  Rider already exists:\n   Email: ${RIDER.email}\n   Role: ${existing.role}`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(RIDER.password, salt);

    const rider = await User.create({
      name: RIDER.name,
      email: RIDER.email,
      password: hashedPassword,
      role: RIDER.role
    });

    console.log('\n🎉 Rider account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Name     : ${rider.name}`);
    console.log(`  Email    : ${RIDER.email}`);
    console.log(`  Password : ${RIDER.password}`);
    console.log(`  Role     : ${rider.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Use these credentials to log in at /login with the "Rider" tab selected.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating rider:', err.message);
    process.exit(1);
  }
};

seed();
