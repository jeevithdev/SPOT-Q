const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB Atlas connection
const testAtlasConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    // Load connection string from environment or use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sakthiautospotq_db_user:mRquJDKoXD5aghcm@spot-q.pphkeph.mongodb.net/?retryWrites=true&w=majority&appName=Spot-Q';
    
    console.log(`📍 Connecting to: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Collections found: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📝 Collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Test database write operation
    const testCollection = mongoose.connection.db.collection('connectionTest');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: 'MongoDB Atlas connection test successful'
    };
    
    await testCollection.insertOne(testDoc);
    console.log('✅ Write test successful');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    
    if (error.message.includes('authentication failed')) {
      console.log('   💡 Check your username and password');
    } else if (error.message.includes('not authorized')) {
      console.log('   💡 Check database user permissions');
    } else if (error.message.includes('IP not whitelisted')) {
      console.log('   💡 Add your IP address to MongoDB Atlas Network Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('   💡 Check your connection string format');
    } else if (error.message.includes('ETIMEDOUT')) {
      console.log('   💡 Check network connectivity and firewall settings');
    }
    
    console.log('\n📚 See MONGODB_ATLAS_SETUP.md for detailed setup instructions');
  }
};

testAtlasConnection();
