const axios = require('axios');

async function debugEmailService() {
  console.log('🔍 Debugging Email Service...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:3000/api/health');
    console.log('✅ Server is running:', healthResponse.data);

    // Test 2: Check if admin user exists
    console.log('\n2. Testing admin login to verify user exists...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    console.log('✅ Admin login successful');

    // Test 3: Try password reset
    console.log('\n3. Testing password reset...');
    const resetResponse = await axios.post('http://localhost:3000/api/auth/forgot-password', {
      email: 'ashishjaiswal0701@gmail.com'
    });
    console.log('✅ Password reset successful:', resetResponse.data);

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugEmailService(); 