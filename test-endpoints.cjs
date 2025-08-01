const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('🧪 Testing Backend Endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing Health Endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health:', health.data);

    // Test projects endpoint
    console.log('\n2. Testing Projects Endpoint...');
    const projects = await axios.get(`${API_BASE}/projects`);
    console.log('✅ Projects:', projects.data);

    // Test testimonials endpoint
    console.log('\n3. Testing Testimonials Endpoint...');
    const testimonials = await axios.get(`${API_BASE}/testimonials`);
    console.log('✅ Testimonials:', testimonials.data);

    // Test blogs endpoint
    console.log('\n4. Testing Blogs Endpoint...');
    const blogs = await axios.get(`${API_BASE}/blogs`);
    console.log('✅ Blogs:', blogs.data);

    // Test contacts endpoint
    console.log('\n5. Testing Contacts Endpoint...');
    const contacts = await axios.get(`${API_BASE}/contacts`);
    console.log('✅ Contacts:', contacts.data);

    // Test admin login endpoint
    console.log('\n6. Testing Admin Login Endpoint...');
    try {
      const adminLogin = await axios.post(`${API_BASE}/admin/login`, {
        email: 'admin',
        password: 'admin123'
      });
      console.log('✅ Admin Login:', adminLogin.data);
    } catch (error) {
      console.log('❌ Admin Login Error:', error.response?.data || error.message);
    }

    // Test user registration endpoint
    console.log('\n7. Testing User Registration Endpoint...');
    try {
      const userReg = await axios.post(`${API_BASE}/user/register`, {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('✅ User Registration:', userReg.data);
    } catch (error) {
      console.log('❌ User Registration Error:', error.response?.data || error.message);
    }

    // Test analytics endpoint
    console.log('\n8. Testing Analytics Endpoint...');
    try {
      const analytics = await axios.get(`${API_BASE}/admin/analytics`);
      console.log('✅ Analytics:', analytics.data);
    } catch (error) {
      console.log('❌ Analytics Error:', error.response?.data || error.message);
    }

    console.log('\n🎉 All endpoint tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints(); 