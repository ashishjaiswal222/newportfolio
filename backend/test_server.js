const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testServer() {
  try {
    console.log('🔍 Testing server connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health endpoint:', healthResponse.data);
    
    // Test auth endpoint
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: 'admin123'
    });
    console.log('✅ Auth endpoint:', authResponse.data);
    
    // Test public endpoints
    const contactsResponse = await axios.get(`${BASE_URL}/api/contacts`);
    console.log('✅ Contacts endpoint:', contactsResponse.data);
    
    const testimonialsResponse = await axios.get(`${BASE_URL}/api/testimonials`);
    console.log('✅ Testimonials endpoint:', testimonialsResponse.data);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

testServer(); 