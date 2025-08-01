const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🔧 Testing Fixed Endpoints...\n');

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  if (data) {
    console.log(`   Status: ${data.status || 'N/A'}`);
    console.log(`   Data:`, JSON.stringify(data.data || data, null, 2));
  }
  if (error) {
    console.log(`   Error: ${error.response?.status || 'N/A'}`);
    console.log(`   Details:`, JSON.stringify(error.response?.data || error.message, null, 2));
  }
  console.log('');
}

// Test 1: User Login
async function testUserLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, {
      email: 'testuser@example.com',
      password: 'TestPassword123!'
    });
    logTest('User Login', true, response);
    return response.data.token;
  } catch (error) {
    logTest('User Login', false, null, error);
    return null;
  }
}

// Test 2: User Profile (Fixed)
async function testUserProfile(userToken) {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logTest('User Profile (Fixed)', true, response);
    return true;
  } catch (error) {
    logTest('User Profile (Fixed)', false, null, error);
    return false;
  }
}

// Test 3: User Logout (Fixed)
async function testUserLogout(userToken) {
  try {
    const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logTest('User Logout (Fixed)', true, response);
    return true;
  } catch (error) {
    logTest('User Logout (Fixed)', false, null, error);
    return false;
  }
}

// Test 4: Admin Login
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

// Test 5: Create Project (Admin) - Fixed
async function testCreateProject(adminToken) {
  try {
    const projectData = {
      title: 'Test Project from Admin (Fixed)',
      description: 'A test project created by admin after fixes',
      content: 'Project content here',
      technologies: ['React', 'Node.js'],
      category: 'Web Development',
      demoUrl: 'https://demo.com',
      githubUrl: 'https://github.com/test',
      featured: false,
      status: 'active'
    };
    const response = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Project (Admin) - Fixed', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Project (Admin) - Fixed', false, null, error);
    return null;
  }
}

// Test 6: Create Blog (Admin) - Fixed
async function testCreateBlog(adminToken) {
  try {
    const blogData = {
      title: 'Test Blog Post from Admin (Fixed)',
      content: '<h2>Test Content</h2><p>This is a test blog post created by admin after fixes.</p>',
      excerpt: 'A test excerpt',
      author: 'Ashish Jaiswal',
      categories: ['Technology'],
      tags: ['test', 'admin', 'fixed'],
      status: 'published',
      featured: false
    };
    const response = await axios.post(`${BASE_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Blog (Admin) - Fixed', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Blog (Admin) - Fixed', false, null, error);
    return null;
  }
}

// Test 7: Test without admin token (should fail)
async function testCreateProjectWithoutAdmin() {
  try {
    const projectData = {
      title: 'Unauthorized Project',
      description: 'This should fail',
      content: 'Content',
      technologies: ['React'],
      category: 'Web Development'
    };
    const response = await axios.post(`${BASE_URL}/projects`, projectData);
    logTest('Create Project Without Admin (Should Fail)', false, response);
    return false;
  } catch (error) {
    logTest('Create Project Without Admin (Should Fail)', true, null, error);
    return true;
  }
}

// Test 8: Test without admin token for blog (should fail)
async function testCreateBlogWithoutAdmin() {
  try {
    const blogData = {
      title: 'Unauthorized Blog',
      content: 'This should fail',
      author: 'Test'
    };
    const response = await axios.post(`${BASE_URL}/blogs`, blogData);
    logTest('Create Blog Without Admin (Should Fail)', false, response);
    return false;
  } catch (error) {
    logTest('Create Blog Without Admin (Should Fail)', true, null, error);
    return true;
  }
}

// Main test runner
async function runFixTests() {
  console.log('🚀 Testing all fixes...\n');
  
  // Test 1: User Login
  const userToken = await testUserLogin();
  
  // Test 2: User Profile (Fixed)
  if (userToken) {
    await testUserProfile(userToken);
  }
  
  // Test 3: User Logout (Fixed)
  if (userToken) {
    await testUserLogout(userToken);
  }
  
  // Test 4: Admin Login
  const adminToken = await testAdminLogin();
  
  // Test 5: Create Project (Admin) - Fixed
  if (adminToken) {
    await testCreateProject(adminToken);
  }
  
  // Test 6: Create Blog (Admin) - Fixed
  if (adminToken) {
    await testCreateBlog(adminToken);
  }
  
  // Test 7: Test without admin token (should fail)
  await testCreateProjectWithoutAdmin();
  
  // Test 8: Test without admin token for blog (should fail)
  await testCreateBlogWithoutAdmin();
  
  console.log('🎉 All fix tests completed!');
}

// Run the tests
runFixTests().catch(console.error); 