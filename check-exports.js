// check-exports.js
console.log('🔍 CHECKING EXPORTS...\n');

console.log('1. Checking controller exports:');
try {
    const controller = require('./src/controllers/authController');
    console.log('✅ Controller loaded successfully');
    console.log('📋 Exported functions:');
    Object.keys(controller).forEach(key => {
        console.log(`   - ${key}: ${typeof controller[key]}`);
    });
} catch (error) {
    console.log('❌ Controller error:', error.message);
}

console.log('\n2. Checking middleware exports:');
try {
    const middleware = require('./src/middlewares/authMiddleware');
    console.log('✅ Middleware loaded successfully');
    console.log('📋 Exported functions:');
    Object.keys(middleware).forEach(key => {
        console.log(`   - ${key}: ${typeof middleware[key]}`);
    });
} catch (error) {
    console.log('❌ Middleware error:', error.message);
}

console.log('\n3. Checking route files:');
try {
    const authRoutes = require('./src/routes/authRoutes');
    console.log('✅ Auth routes loaded');
} catch (error) {
    console.log('❌ Auth routes error:', error.message);
}

try {
    const adminRoutes = require('./src/routes/adminRoutes');
    console.log('✅ Admin routes loaded');
} catch (error) {
    console.log('❌ Admin routes error:', error.message);
}

console.log('\n✅ DIAGNOSIS COMPLETE');