const axios = require('axios');

const ADMIN_LOGIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME || 'ashishjaiswal0701@gmail.com';
const ADMIN_LOGIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD || '@fusu649Ib';

async function testAdminLoginFlow() {
  try {
    console.log('1️⃣ Testing Admin Login...');
    const loginRes = await axios.post('http://localhost:3000/auth/login', {
      email: ADMIN_LOGIN_USERNAME,
      password: ADMIN_LOGIN_PASSWORD
    });
    const token = loginRes.data.token;
    console.log('✅ Login successful! Token:', token.substring(0, 32) + '...');

    console.log('\n2️⃣ Testing JWT session (protected endpoint)...');
    const profileRes = await axios.get('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Accessed protected endpoint! Admin:', profileRes.data.admin.email);

    console.log('\n3️⃣ Testing token verification...');
    const verifyRes = await axios.get('http://localhost:3000/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token is valid:', verifyRes.data.valid);

    console.log('\n4️⃣ Testing logout...');
    const logoutRes = await axios.post('http://localhost:3000/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Logout successful:', logoutRes.data.message);

    console.log('\n🎉 All admin login/session/logout tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminLoginFlow(); 