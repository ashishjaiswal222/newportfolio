const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🔍 Debugging Remaining Issues...\n');

// Helper function to log detailed test results
function logDetailedTest(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  if (data) {
    console.log(`   Response Status: ${data.status || 'N/A'}`);
    console.log(`   Response Data:`, JSON.stringify(data.data || data, null, 2));
  }
  if (error) {
    console.log(`   Error Status: ${error.response?.status || 'N/A'}`);
    console.log(`   Error Message:`, error.response?.data || error.message);
    console.log(`   Full Error:`, JSON.stringify(error.response?.data || error, null, 2));
  }
  console.log('');
}

// Test 1: User Registration (Debug)
async function testUserRegistrationDebug() {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, {
      name: 'Debug User',
      email: 'debuguser@example.com',
      password: 'DebugPassword123!'
    });
    logDetailedTest('User Registration (Debug)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('User Registration (Debug)', false, null, error);
    return null;
  }
}

// Test 2: User Profile (Debug)
async function testUserProfileDebug() {
  try {
    // First login to get token
    const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
      email: 'testuser@example.com',
      password: 'TestPassword123!'
    });
    
    const userToken = loginResponse.data.token;
    console.log('🔑 Got user token:', userToken.substring(0, 50) + '...');
    
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logDetailedTest('User Profile (Debug)', true, response);
    return true;
  } catch (error) {
    logDetailedTest('User Profile (Debug)', false, null, error);
    return false;
  }
}

// Test 3: User Logout (Debug)
async function testUserLogoutDebug() {
  try {
    // First login to get token
    const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
      email: 'testuser@example.com',
      password: 'TestPassword123!'
    });
    
    const userToken = loginResponse.data.token;
    console.log('🔑 Got user token for logout:', userToken.substring(0, 50) + '...');
    
    const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logDetailedTest('User Logout (Debug)', true, response);
    return true;
  } catch (error) {
    logDetailedTest('User Logout (Debug)', false, null, error);
    return false;
  }
}

// Test 4: Create Project (Admin) - Debug
async function testCreateProjectDebug() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token:', adminToken.substring(0, 50) + '...');
    
    const projectData = {
      title: 'Debug Project from Admin',
      description: 'A debug project created by admin',
      content: 'Project content here',
      technologies: ['React', 'Node.js'],
      category: 'Web Development',
      demoUrl: 'https://demo.com',
      githubUrl: 'https://github.com/test',
      featured: false,
      status: 'active'
    };
    
    console.log('📝 Sending project data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Create Project (Admin) - Debug', true, response);
    return response.data.id;
  } catch (error) {
    logDetailedTest('Create Project (Admin) - Debug', false, null, error);
    return null;
  }
}

// Test 5: Create Blog (Admin) - Debug
async function testCreateBlogDebug() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token for blog:', adminToken.substring(0, 50) + '...');
    
    const blogData = {
      title: 'Debug Blog Post from Admin',
      content: '<h2>Debug Content</h2><p>This is a debug blog post created by admin.</p>',
      excerpt: 'A debug excerpt',
      author: 'Ashish Jaiswal',
      categories: ['Technology'],
      tags: ['debug', 'admin'],
      status: 'published',
      featured: false
    };
    
    console.log('📝 Sending blog data:', JSON.stringify(blogData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Create Blog (Admin) - Debug', true, response);
    return response.data.id;
  } catch (error) {
    logDetailedTest('Create Blog (Admin) - Debug', false, null, error);
    return null;
  }
}

// Main debug runner
async function runDebugTests() {
  console.log('🚀 Starting debug tests for remaining issues...\n');
  
  // Test 1: User Registration (Debug)
  await testUserRegistrationDebug();
  
  // Test 2: User Profile (Debug)
  await testUserProfileDebug();
  
  // Test 3: User Logout (Debug)
  await testUserLogoutDebug();
  
  // Test 4: Create Project (Admin) - Debug
  await testCreateProjectDebug();
  
  // Test 5: Create Blog (Admin) - Debug
  await testCreateBlogDebug();
  
  console.log('🎉 Debug tests completed!');
}

// Run the debug tests
runDebugTests().catch(console.error); 