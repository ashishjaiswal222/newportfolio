const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🔍 Testing with Full Error Logging...\n');

// Helper function to log detailed error
function logDetailedError(testName, error) {
  console.log(`❌ ${testName}`);
  console.log(`   Error Status: ${error.response?.status || 'N/A'}`);
  console.log(`   Error Message:`, error.response?.data || error.message);
  console.log(`   Full Error Response:`, JSON.stringify(error.response?.data, null, 2));
  console.log(`   Error Headers:`, JSON.stringify(error.response?.headers, null, 2));
  console.log(`   Request URL:`, error.config?.url);
  console.log(`   Request Method:`, error.config?.method);
  console.log(`   Request Data:`, JSON.stringify(error.config?.data, null, 2));
  console.log('');
}

// Test 1: Project Create with Error Logging
async function testProjectCreateWithErrorLogging() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token for project test');
    
    const projectData = {
      title: 'Error Test Project',
      description: 'A test project for error logging',
      content: 'Test content',
      category: 'Web Development'
    };
    
    console.log('📝 Sending project data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Project Create Success:', response.data);
    return response.data.id;
  } catch (error) {
    logDetailedError('Project Create with Error Logging', error);
    return null;
  }
}

// Test 2: Blog Create with Error Logging
async function testBlogCreateWithErrorLogging() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token for blog test');
    
    const blogData = {
      title: 'Error Test Blog',
      content: 'Test blog content',
      excerpt: 'Test excerpt',
      author: 'Test Author',
      categories: ['Technology'],
      tags: ['test']
    };
    
    console.log('📝 Sending blog data:', JSON.stringify(blogData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Blog Create Success:', response.data);
    return response.data.id;
  } catch (error) {
    logDetailedError('Blog Create with Error Logging', error);
    return null;
  }
}

// Test 3: Check server health
async function testServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server Health Check:', response.data);
    return true;
  } catch (error) {
    logDetailedError('Server Health Check', error);
    return false;
  }
}

// Main test runner
async function runErrorLoggingTests() {
  console.log('🚀 Starting error logging tests...\n');
  
  // Test 1: Server Health
  await testServerHealth();
  
  // Test 2: Project Create with Error Logging
  await testProjectCreateWithErrorLogging();
  
  // Test 3: Blog Create with Error Logging
  await testBlogCreateWithErrorLogging();
  
  console.log('🎉 Error logging tests completed!');
}

// Run the tests
runErrorLoggingTests().catch(console.error); 