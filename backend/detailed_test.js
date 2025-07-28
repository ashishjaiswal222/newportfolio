const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    console.log(`\n🔍 Testing ${method} ${endpoint}...`);
    
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ Success (${response.status}):`, response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.log(`   Request error: ${error.request}`);
    }
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting detailed endpoint tests...\n');
  
  // Test health endpoint
  await testEndpoint('/api/health');
  
  // Test auth endpoint
  await testEndpoint('/api/auth/login', 'POST', {
    email: 'ashishjaiswal0701@gmail.com',
    password: 'admin123'
  });
  
  // Test public endpoints
  await testEndpoint('/api/contacts');
  await testEndpoint('/api/testimonials');
  await testEndpoint('/api/projects');
  await testEndpoint('/api/blogs');
  
  // Test admin endpoints without auth (should fail)
  await testEndpoint('/api/admin/contacts');
  await testEndpoint('/api/admin/testimonials');
  await testEndpoint('/api/admin/projects');
  await testEndpoint('/api/admin/blogs');
  await testEndpoint('/api/admin/analytics');
  
  console.log('\n🎉 All tests completed!');
}

runTests().catch(console.error); 