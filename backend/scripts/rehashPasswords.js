const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
    employeeId: String,
    name: String,
    department: String,
    role: String,
    password: { type: String, select: true },
    isActive: Boolean
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function rehashAllPasswords() {
  try {
    console.log('Starting password rehash process...\n');

    // Get all users with their passwords
    const users = await User.find().select('+password');

    console.log(`Found ${users.length} users\n`);

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
      const isHashed = user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'));

      if (isHashed) {
        console.log(`✓ ${user.employeeId} (${user.name}) - Password already hashed, skipping`);
        continue;
      }

      // Password is plain text, hash it
      console.log(`→ ${user.employeeId} (${user.name}) - Hashing password...`);

      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Update directly without triggering pre-save hook
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      console.log(`✓ ${user.employeeId} (${user.name}) - Password hashed successfully`);
    }

    console.log('\n✅ All passwords have been rehashed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error rehashing passwords:', error);
    process.exit(1);
  }
}

// Run the script
rehashAllPasswords();
