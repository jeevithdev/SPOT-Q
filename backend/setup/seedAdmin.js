// backend/setup/seedAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user'); 

// Load environment variables 
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

// --- ADMIN CONSTANTS ---
const ADMIN_ID = 'ADMIN'; 
const ADMIN_NAME = 'SpotQ Administrator';
const ADMIN_PASS = 'Admin@123'; 
const ADMIN_DEPT = 'Admin';
// -----------------------

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected for Admin Seeding.');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    await connectDB();
    try {
        const adminExists = await User.findOne({ employeeId: ADMIN_ID });

        if (adminExists) {
            console.log(`✅ Admin user (${ADMIN_ID}) already exists. Skipping seed.`);
            return;
        }

        const adminUser = new User({
            employeeId: ADMIN_ID,
            name: ADMIN_NAME,
            password: ADMIN_PASS,
            department: ADMIN_DEPT,
            role: 'admin',
            isActive: true
        });

        await adminUser.save();
        console.log(`🎉 Initial Admin user (${ADMIN_ID}) created successfully.`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📋 Employee ID: ${ADMIN_ID}`);
        console.log(`🔑 Password: ${ADMIN_PASS}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    } finally {
        mongoose.connection.close();
        console.log('Seeding process finished.');
    }
};

seedAdmin();

