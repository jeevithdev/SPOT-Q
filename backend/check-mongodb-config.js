const mongoose = require('mongoose');

// Check MongoDB configuration and network accessibility
const checkMongoDBConfig = async () => {
  console.log('🔍 Checking MongoDB Configuration...\n');
  
  // Test different connection scenarios
  const testCases = [
    {
      name: 'MongoDB Atlas Connection',
      uri: process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/yourDatabase?retryWrites=true&w=majority'
    },
    {
      name: 'MongoDB Atlas with direct connection',
      uri: (process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/yourDatabase?retryWrites=true&w=majority') + '&directConnection=true'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📍 URI: ${testCase.uri}`);
    
    try {
      const startTime = Date.now();
      const conn = await mongoose.connect(testCase.uri, {
        maxPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      });
      
      const endTime = Date.now();
      console.log(`✅ SUCCESS! Connected in ${endTime - startTime}ms`);
      console.log(`📍 Host: ${conn.connection.host}`);
      console.log(`🗄️  Database: ${conn.connection.name}`);
      
      await mongoose.connection.close();
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.message}`);
      
      // Provide specific troubleshooting based on error
      if (error.message.includes('ECONNREFUSED')) {
        console.log('   💡 MongoDB server is not running or not accessible');
      } else if (error.message.includes('ETIMEDOUT')) {
        console.log('   💡 Connection timeout - check network and firewall');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('   💡 IP address not found - check if computers are on same network');
      }
    }
  }
  
  console.log('\n🔧 MongoDB Atlas Troubleshooting Checklist:');
  console.log('1. ✅ Correct connection string format?');
  console.log('2. ✅ Username and password correct?');
  console.log('3. ✅ Database user has proper permissions?');
  console.log('4. ✅ IP address whitelisted in Atlas?');
  console.log('5. ✅ Cluster is running and accessible?');
  console.log('6. ✅ Network connectivity to Atlas?');
  console.log('7. ✅ Connection string uses mongodb+srv://?');
};

checkMongoDBConfig().catch(console.error);
