const mongoose = require('mongoose');

// Quick test of your MongoDB Atlas connection
const quickTest = async () => {
  console.log('🚀 Quick MongoDB Atlas Connection Test');
  console.log('=====================================\n');
  
  const mongoURI = 'mongodb+srv://sakthiautospotq_db_user:mRquJDKoXD5aghcm@spot-q.pphkeph.mongodb.net/?retryWrites=true&w=majority&appName=Spot-Q';
  
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('📍 Cluster: spot-q.pphkeph.mongodb.net');
    console.log('👤 User: sakthiautospotq_db_user');
    console.log('📱 App: Spot-Q\n');
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔌 Port: ${conn.connection.port}`);
    
    // Test database operations
    const db = conn.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📋 Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📝 Available collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Test write operation
    const testCollection = db.collection('connectionTest');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: 'Spot-Q Atlas connection test successful',
      appName: 'Spot-Q'
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log(`✅ Write test successful - Document ID: ${result.insertedId}`);
    
    // Clean up
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    console.log('\n🎉 Your MongoDB Atlas setup is working perfectly!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Common issues:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Ensure the cluster is running');
    console.log('4. Check your internet connection');
  }
};

quickTest();
