const axios = require('axios').default;
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const BASE_URL = 'http://localhost:3000';
const jar = new tough.CookieJar();
const api = wrapper(axios.create({ baseURL: BASE_URL, withCredentials: true, jar }));

// Hardcoded for test (replace with your .env values)
const ADMIN_EMAIL = 'ashishjaiswal0701@gmail.com';
const ADMIN_PASSWORD = 'admin123';

async function testSecureAuth() {
  try {
    console.log('1️⃣ Testing login...');
    let res = await api.post('/api/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    console.log('✅ Login:', res.data.message);

    console.log('2️⃣ Testing access to protected endpoint...');
    res = await api.get('/api/admin/contacts');
    if (Array.isArray(res.data) || res.data.contacts) {
      console.log('✅ Accessed protected endpoint!');
    } else {
      throw new Error('Failed to access protected endpoint');
    }

    console.log('3️⃣ Testing refresh token...');
    res = await api.post('/api/auth/refresh');
    console.log('✅ Refresh:', res.data.message);

    console.log('4️⃣ Testing logout...');
    res = await api.post('/api/auth/logout');
    console.log('✅ Logout:', res.data.message);

    console.log('5️⃣ Testing access to protected endpoint after logout (should fail)...');
    try {
      await api.get('/api/admin/contacts');
      console.log('❌ Should not access protected endpoint after logout!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('✅ Protected endpoint blocked after logout!');
      } else {
        throw err;
      }
    }

    console.log('\n🎉 All secure admin auth tests passed!');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    if (err.response) {
      console.error('Status:', err.response.status, 'Data:', err.response.data);
    }
    console.error('Full error:', err);
  }
}

testSecureAuth(); 