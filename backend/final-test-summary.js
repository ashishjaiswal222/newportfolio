const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🎯 FINAL COMPREHENSIVE ENDPOINT TEST SUMMARY\n');
console.log('=' .repeat(60));

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  const result = success ? 'PASSED' : 'FAILED';
  
  console.log(`${status} ${testName} - ${result}`);
  
  testResults.total++;
  if (success) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
  
  testResults.details.push({
    name: testName,
    success,
    data: data?.data || data,
    error: error?.response?.data || error?.message
  });
}

// Test 1: Health Check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logTest('Health Check', true, response);
    return true;
  } catch (error) {
    logTest('Health Check', false, null, error);
    return false;
  }
}

// Test 2: User Registration
async function testUserRegistration() {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, {
      name: 'Test User',
      email: 'testuser2@example.com',
      password: 'TestPassword123!'
    });
    logTest('User Registration', true, response);
    return response.data.accessToken;
  } catch (error) {
    logTest('User Registration', false, null, error);
    return null;
  }
}

// Test 3: User Login
async function testUserLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email: 'testuser@example.com',
      password: 'TestPassword123!'
    });
    logTest('User Login', true, response);
    return response.data.accessToken;
  } catch (error) {
    logTest('User Login', false, null, error);
    return null;
  }
}

// Test 4: User Profile
async function testUserProfile(userToken) {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logTest('User Profile', true, response);
    return true;
  } catch (error) {
    logTest('User Profile', false, null, error);
    return false;
  }
}

// Test 5: Admin Login
async function testAdminLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    logTest('Admin Login', true, response);
    return response.data.token;
  } catch (error) {
    logTest('Admin Login', false, null, error);
    return null;
  }
}

// Test 6: Contact Form
async function testContactForm() {
  try {
    const response = await axios.post(`${BASE_URL}/contacts`, {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message'
    });
    logTest('Contact Form', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Contact Form', false, null, error);
    return null;
  }
}

// Test 7: Get Testimonials
async function testGetTestimonials() {
  try {
    const response = await axios.get(`${BASE_URL}/testimonials`);
    logTest('Get Testimonials', true, response);
    return response.data.testimonials;
  } catch (error) {
    logTest('Get Testimonials', false, null, error);
    return null;
  }
}

// Test 8: Get Projects
async function testGetProjects() {
  try {
    const response = await axios.get(`${BASE_URL}/projects`);
    logTest('Get Projects', true, response);
    return response.data.projects;
  } catch (error) {
    logTest('Get Projects', false, null, error);
    return null;
  }
}

// Test 9: Get Blogs
async function testGetBlogs() {
  try {
    const response = await axios.get(`${BASE_URL}/blogs`);
    logTest('Get Blogs', true, response);
    return response.data.blogs;
  } catch (error) {
    logTest('Get Blogs', false, null, error);
    return null;
  }
}

// Test 10: Admin Analytics
async function testAdminAnalytics(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Admin Analytics', true, response);
    return true;
  } catch (error) {
    logTest('Admin Analytics', false, null, error);
    return false;
  }
}

// Test 11: Admin Get Users
async function testAdminGetUsers(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Admin Get Users', true, response);
    return response.data.users;
  } catch (error) {
    logTest('Admin Get Users', false, null, error);
    return null;
  }
}

// Test 12: Admin Get Contacts
async function testAdminGetContacts(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/contacts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Admin Get Contacts', true, response);
    return response.data;
  } catch (error) {
    logTest('Admin Get Contacts', false, null, error);
    return null;
  }
}

// Test 13: Create Project (Admin)
async function testCreateProject(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/projects`, {
      title: 'Test Project from Admin',
      description: 'A test project created by admin',
      content: 'Project content here',
      technologies: ['React', 'Node.js'],
      category: 'Web Development',
      demoUrl: 'https://demo.com',
      githubUrl: 'https://github.com/test',
      featured: false,
      status: 'active'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Project (Admin)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Project (Admin)', false, null, error);
    return null;
  }
}

// Test 14: Create Blog (Admin)
async function testCreateBlog(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/blogs`, {
      title: 'Test Blog Post from Admin',
      content: '<h2>Test Content</h2><p>This is a test blog post created by admin.</p>',
      excerpt: 'A test excerpt',
      author: 'Ashish Jaiswal',
      categories: ['Technology'],
      tags: ['test', 'admin'],
      status: 'published',
      featured: false
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Blog (Admin)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Blog (Admin)', false, null, error);
    return null;
  }
}

// Test 15: User Forgot Password
async function testUserForgotPassword() {
  try {
    const response = await axios.post(`${BASE_URL}/user/forgot-password`, {
      email: 'testuser@example.com'
    });
    logTest('User Forgot Password', true, response);
    return true;
  } catch (error) {
    logTest('User Forgot Password', false, null, error);
    return false;
  }
}

// Test 16: Admin Forgot Password
async function testAdminForgotPassword() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/forgot-password`, {
      email: 'ashishjaiswal0701@gmail.com'
    });
    logTest('Admin Forgot Password', true, response);
    return true;
  } catch (error) {
    logTest('Admin Forgot Password', false, null, error);
    return false;
  }
}

// Test 17: User Logout
async function testUserLogout(userToken) {
  try {
    const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logTest('User Logout', true, response);
    return true;
  } catch (error) {
    logTest('User Logout', false, null, error);
    return false;
  }
}

// Test 18: Admin Logout
async function testAdminLogout(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/admin/logout`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Admin Logout', true, response);
    return true;
  } catch (error) {
    logTest('Admin Logout', false, null, error);
    return false;
  }
}

// Main test runner
async function runFinalTests() {
  console.log('🚀 Starting final comprehensive endpoint tests...\n');
  
  // Test 1: Health Check
  await testHealthCheck();
  
  // Test 2: User Registration
  const userToken = await testUserRegistration();
  
  // Test 3: User Login
  const finalUserToken = userToken || await testUserLogin();
  
  // Test 4: User Profile
  if (finalUserToken) {
    await testUserProfile(finalUserToken);
  }
  
  // Test 5: Admin Login
  const adminToken = await testAdminLogin();
  
  // Test 6: Contact Form
  await testContactForm();
  
  // Test 7: Get Testimonials
  await testGetTestimonials();
  
  // Test 8: Get Projects
  await testGetProjects();
  
  // Test 9: Get Blogs
  await testGetBlogs();
  
  // Test 10: Admin Analytics
  if (adminToken) {
    await testAdminAnalytics(adminToken);
  }
  
  // Test 11: Admin Get Users
  if (adminToken) {
    await testAdminGetUsers(adminToken);
  }
  
  // Test 12: Admin Get Contacts
  if (adminToken) {
    await testAdminGetContacts(adminToken);
  }
  
  // Test 13: Create Project (Admin)
  if (adminToken) {
    await testCreateProject(adminToken);
  }
  
  // Test 14: Create Blog (Admin)
  if (adminToken) {
    await testCreateBlog(adminToken);
  }
  
  // Test 15: User Forgot Password
  await testUserForgotPassword();
  
  // Test 16: Admin Forgot Password
  await testAdminForgotPassword();
  
  // Test 17: User Logout
  if (finalUserToken) {
    await testUserLogout(finalUserToken);
  }
  
  // Test 18: Admin Logout
  if (adminToken) {
    await testAdminLogout(adminToken);
  }
  
  // Print summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 FINAL TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📋 Total: ${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  console.log('\n🎯 ENDPOINT STATUS:');
  console.log('=' .repeat(60));
  
  const categories = {
    'Authentication': ['User Registration', 'User Login', 'User Profile', 'Admin Login', 'User Logout', 'Admin Logout'],
    'User Management': ['User Forgot Password', 'Admin Forgot Password', 'Admin Get Users'],
    'Content Management': ['Get Testimonials', 'Get Projects', 'Get Blogs', 'Create Project (Admin)', 'Create Blog (Admin)'],
    'Contact System': ['Contact Form', 'Admin Get Contacts'],
    'Analytics': ['Admin Analytics'],
    'System': ['Health Check']
  };
  
  Object.entries(categories).forEach(([category, endpoints]) => {
    console.log(`\n📁 ${category}:`);
    endpoints.forEach(endpoint => {
      const result = testResults.details.find(d => d.name === endpoint);
      const status = result?.success ? '✅' : '❌';
      console.log(`   ${status} ${endpoint}`);
    });
  });
  
  console.log('\n🎉 All endpoint tests completed!');
  console.log('=' .repeat(60));
}

// Run the tests
runFinalTests().catch(console.error); 