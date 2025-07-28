const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const ADMIN_EMAIL = 'ashishjaiswal0701@gmail.com';
const ADMIN_PASSWORD = '@fusu649Ib';

async function simpleTest() {
  console.log('🚀 Simple Admin System Test...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test 2: Admin Login
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    }, {
      withCredentials: true
    });
    console.log('✅ Login successful:', loginResponse.data);

    // Test 3: Get Public Testimonials
    console.log('\n3. Testing public testimonials...');
    const testimonialsResponse = await axios.get(`${BASE_URL}/api/testimonials`);
    console.log('✅ Public testimonials:', testimonialsResponse.data);

    // Test 4: Get Public Contacts
    console.log('\n4. Testing public contacts...');
    const contactsResponse = await axios.get(`${BASE_URL}/api/contacts`);
    console.log('✅ Public contacts:', contactsResponse.data);

    console.log('\n🎉 Basic tests passed! Admin system is working.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

simpleTest(); 