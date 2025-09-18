const mongoose = require('mongoose');

// Database configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/loginapp';
    
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('\n MongoDB is not running. Please start MongoDB or use MongoDB Atlas.');
    console.log('\n🔄 Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

// Database health check
const checkDatabaseHealth = async () => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    return {
      status: states[state] || 'unknown',
      readyState: state,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
};

// Database utilities
const dbUtils = {
  // Clear all collections (for testing)
  clearAllCollections: async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  },

  // Get collection stats
  getCollectionStats: async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const stats = {};
    
    for (let collection of collections) {
      const collectionName = collection.name;
      const count = await mongoose.connection.db.collection(collectionName).countDocuments();
      stats[collectionName] = { count };
    }
    
    return stats;
  },

  // Create indexes for better performance
  createIndexes: async () => {
    try {
      // User collection indexes
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.db.collection('users').createIndex({ 'socialIds.googleId': 1 });
      await mongoose.connection.db.collection('users').createIndex({ resetPasswordToken: 1 });
      await mongoose.connection.db.collection('users').createIndex({ verificationToken: 1 });
      await mongoose.connection.db.collection('users').createIndex({ createdAt: -1 });
      
      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }
};

module.exports = {
  connectDB,
  checkDatabaseHealth,
  dbUtils
};
