const path = require('path');

try {
  console.log('🔍 Testing Email Service Import...\n');
  
  // Test 1: Check if email service file exists
  const emailServicePath = path.join(__dirname, 'src', 'services', 'email.service.ts');
  console.log('1. Email service path:', emailServicePath);
  
  // Test 2: Try to require the compiled version
  const emailService = require('./src/services/email.service.js');
  console.log('2. ✅ Email service imported successfully');
  console.log('3. Email service type:', typeof emailService);
  console.log('4. Email service methods:', Object.getOwnPropertyNames(emailService));
  
  // Test 3: Check if sendPasswordResetEmail method exists
  if (typeof emailService.sendPasswordResetEmail === 'function') {
    console.log('5. ✅ sendPasswordResetEmail method exists');
  } else {
    console.log('5. ❌ sendPasswordResetEmail method does not exist');
  }
  
  console.log('\n🎉 Email service import test completed!');
  
} catch (error) {
  console.error('❌ Email service import failed:', error.message);
  console.error('Full error:', error);
} 