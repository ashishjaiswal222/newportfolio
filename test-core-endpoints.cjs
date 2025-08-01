const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testCoreEndpoints() {
  console.log('🧪 Testing Core Backend Endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${API_BASE}/health`,
      data: null
    },
    {
      name: 'Projects',
      method: 'GET',
      url: `${API_BASE}/projects`,
      data: null
    },
    {
      name: 'Testimonials',
      method: 'GET',
      url: `${API_BASE}/testimonials`,
      data: null
    },
    {
      name: 'Blogs',
      method: 'GET',
      url: `${API_BASE}/blogs`,
      data: null
    },
    {
      name: 'Admin Login',
      method: 'POST',
      url: `${API_BASE}/admin/login`,
      data: { email: 'admin', password: 'admin123' }
    },
    {
      name: 'User Registration',
      method: 'POST',
      url: `${API_BASE}/user/register`,
      data: { name: 'Test User', email: 'test@example.com', password: 'password123' }
    },
    {
      name: 'Contact Creation',
      method: 'POST',
      url: `${API_BASE}/contacts`,
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        subject: 'Test Contact',
        message: 'This is a test contact message'
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n${test.name}...`);
      
      const config = {
        method: test.method,
        url: test.url,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.data) {
        config.data = test.data;
      }

      const response = await axios(config);
      console.log(`✅ ${test.name}: Success (${response.status})`);
      
      if (response.data && Object.keys(response.data).length > 0) {
        console.log(`   Response:`, JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.message || error.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
  }

  console.log('\n🎉 Core endpoint testing completed!');
}

testCoreEndpoints().catch(console.error); 