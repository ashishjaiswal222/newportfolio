require('dotenv').config();

console.log('🔍 Email Configuration Test...\n');

console.log('Environment Variables:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('COMPANY_EMAIL:', process.env.COMPANY_EMAIL);
console.log('COMPANY_EMAIL_PASSWORD:', process.env.COMPANY_EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

console.log('\nConfig Import Test:');
try {
  const config = require('./src/config/config.js');
  console.log('✅ Config imported successfully');
  console.log('EMAIL_HOST:', config.EMAIL_HOST);
  console.log('EMAIL_PORT:', config.EMAIL_PORT);
  console.log('EMAIL_USER:', config.EMAIL_USER);
  console.log('EMAIL_PASS:', config.EMAIL_PASS ? '***SET***' : 'NOT SET');
  console.log('FRONTEND_URL:', config.FRONTEND_URL);
} catch (error) {
  console.error('❌ Config import failed:', error.message);
}

console.log('\nEmail Service Test:');
try {
  const emailService = require('./src/services/email.service.js');
  console.log('✅ Email service imported successfully');
  console.log('Transporter created:', !!emailService.transporter);
  
  // Test if methods exist
  console.log('sendPasswordResetEmail exists:', typeof emailService.sendPasswordResetEmail === 'function');
  console.log('sendPasswordChangedEmail exists:', typeof emailService.sendPasswordChangedEmail === 'function');
  
} catch (error) {
  console.error('❌ Email service import failed:', error.message);
} 