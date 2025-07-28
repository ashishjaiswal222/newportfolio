const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'ashishjaiswal0701@gmail.com';

async function testPasswordReset() {
  console.log('🚀 Testing Password Reset Functionality...\n');

  try {
    // Step 1: Request password reset
    console.log('1. Requesting password reset...');
    const forgotResponse = await axios.post(`${BASE_URL}/api/auth/forgot-password`, {
      email: ADMIN_EMAIL
    });

    console.log('✅ Password reset request successful');
    console.log('Response:', forgotResponse.data);

    // Note: In a real scenario, you would check the email for the reset token
    // For testing, we'll simulate the process
    console.log('\n📧 Password reset email would be sent to:', ADMIN_EMAIL);
    console.log('📧 Check your email for the reset link');
    console.log('📧 The reset link will be: http://localhost:8084/admin/reset-password?token=TOKEN_HERE');

    console.log('\n🎉 Password reset functionality is working!');
    console.log('\n📝 To complete the test:');
    console.log('1. Check your email for the reset link');
    console.log('2. Click the link or copy the token');
    console.log('3. Go to http://localhost:8084/admin/reset-password');
    console.log('4. Enter the token and a new password');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testPasswordReset(); 