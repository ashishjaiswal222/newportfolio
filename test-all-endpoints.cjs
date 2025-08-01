const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAllEndpoints() {
  console.log('🧪 Testing All Core Backend Endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${API_BASE}/health`,
      data: null
    },
    {
      name: 'Projects List',
      method: 'GET',
      url: `${API_BASE}/projects`,
      data: null
    },
    {
      name: 'Featured Projects',
      method: 'GET',
      url: `${API_BASE}/projects/featured`,
      data: null
    },
    {
      name: 'Single Project',
      method: 'GET',
      url: `${API_BASE}/projects/1e695c2b-1858-4a0f-8e0c-ae1f3144ace3`,
      data: null
    },
    {
      name: 'Project Ratings',
      method: 'GET',
      url: `${API_BASE}/projects/1e695c2b-1858-4a0f-8e0c-ae1f3144ace3/ratings`,
      data: null
    },
    {
      name: 'Add Project Rating',
      method: 'POST',
      url: `${API_BASE}/projects/1e695c2b-1858-4a0f-8e0c-ae1f3144ace3/ratings`,
      data: {
        rating: 4,
        userId: 'test_user_2',
        userName: 'Test User 2'
      }
    },
    {
      name: 'Blogs List',
      method: 'GET',
      url: `${API_BASE}/blogs`,
      data: null
    },
    {
      name: 'Featured Blogs',
      method: 'GET',
      url: `${API_BASE}/blogs/featured`,
      data: null
    },
    {
      name: 'Testimonials',
      method: 'GET',
      url: `${API_BASE}/testimonials`,
      data: null
    },
    {
      name: 'Contacts List',
      method: 'GET',
      url: `${API_BASE}/contacts`,
      data: null
    },
    {
      name: 'Create Contact',
      method: 'POST',
      url: `${API_BASE}/contacts`,
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        subject: 'Test Contact',
        message: 'This is a test contact message'
      }
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
      name: 'Analytics',
      method: 'GET',
      url: `${API_BASE}/admin/analytics`,
      data: null
    }
  ];

  let passed = 0;
  let failed = 0;

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
      passed++;
      
      if (response.data && Object.keys(response.data).length > 0) {
        const dataStr = JSON.stringify(response.data, null, 2);
        console.log(`   Response:`, dataStr.substring(0, 200) + (dataStr.length > 200 ? '...' : ''));
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
      failed++;
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${error.response.data?.message || error.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
  }

  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints are working correctly!');
  } else {
    console.log('\n⚠️  Some endpoints need attention.');
  }
}

testAllEndpoints().catch(console.error); 