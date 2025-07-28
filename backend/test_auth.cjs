const axios = require('axios');

async function testAuth() {
  try {
    console.log('🧪 Testing Admin Authentication...\n');
    
    // Test 1: Admin Login
    console.log('1️⃣ Testing Admin Login...');
    const loginResponse = await axios.post('http://localhost:3000/auth/login', {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', loginResponse.data.token.substring(0, 50) + '...');
    console.log('User:', loginResponse.data.user.name);
    
    const token = loginResponse.data.token;
    
    // Test 2: Verify Token
    console.log('\n2️⃣ Testing Token Verification...');
    const verifyResponse = await axios.get('http://localhost:3000/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Token verified!');
    console.log('Valid:', verifyResponse.data.valid);
    
    // Test 3: Get Admin Profile
    console.log('\n3️⃣ Testing Get Profile...');
    const profileResponse = await axios.get('http://localhost:3000/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile retrieved!');
    console.log('Admin:', profileResponse.data.admin.name);
    console.log('Email:', profileResponse.data.admin.email);
    
    // Test 4: Test Protected Endpoint (should work with token)
    console.log('\n4️⃣ Testing Protected Endpoint...');
    const protectedResponse = await axios.get('http://localhost:3000/testimonials', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Protected endpoint accessible!');
    console.log('Testimonials count:', protectedResponse.data.testimonials.length);
    
    // Test 5: Test Logout
    console.log('\n5️⃣ Testing Logout...');
    const logoutResponse = await axios.post('http://localhost:3000/auth/logout', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Logout successful!');
    console.log('Message:', logoutResponse.data.message);
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📋 Admin Credentials:');
    console.log('Email: ashishjaiswal0701@gmail.com');
    console.log('Password: @fusu649Ib');
    console.log('\n🔐 You can now implement frontend authentication!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAuth(); 