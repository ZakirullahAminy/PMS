const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/ProductCategory');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }
}

createAdmin();
