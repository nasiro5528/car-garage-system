require('dotenv').config();
const mongoose = require('mongoose');

async function dropUserIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    // Drop the problematic index
    await db.collection('users').dropIndex('username_1');
    console.log('✅ Successfully dropped username_1 index');
    
    // Verify indexes
    const indexes = await db.collection('users').indexes();
    console.log('\n📊 Current indexes on users collection:');
    indexes.forEach(idx => console.log(`   - ${idx.name}`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('index not found')) {
      console.log('✅ Index already dropped – no action needed.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
}

dropUserIndex();