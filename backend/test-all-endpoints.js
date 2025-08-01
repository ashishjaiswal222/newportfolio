const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🧪 Testing All Backend Endpoints...\n');

// Test data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'TestPassword123!'
};

const testContact = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  subject: 'Test Message',
  message: 'This is a test message'
};

const testTestimonial = {
  name: 'Test Client',
  role: 'CEO',
  company: 'Test Company',
  content: 'Great work!',
  rating: 5
};

const testProject = {
  title: 'Test Project',
  description: 'A test project',
  content: 'Project content here',
  technologies: ['React', 'Node.js'],
  category: 'Web Development',
  demoUrl: 'https://demo.com',
  githubUrl: 'https://github.com/test'
};

const testBlog = {
  title: 'Test Blog Post',
  content: 'This is a test blog post content.',
  excerpt: 'A test excerpt',
  author: 'Test Author',
  categories: ['Technology'],
  tags: ['test', 'blog']
};

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  if (data) console.log(`   Data:`, data);
  if (error) console.log(`   Error:`, error.message || error);
  console.log('');
}

// Test 1: Health Check
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logTest('Health Check', true, response.data);
    return true;
  } catch (error) {
    logTest('Health Check', false, null, error);
    return false;
  }
}

// Test 2: User Registration
async function testUserRegistration() {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, testUser);
    logTest('User Registration', true, { userId: response.data.user?.id });
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
      email: testUser.email,
      password: testUser.password
    });
    logTest('User Login', true, { userId: response.data.user?.id });
    return response.data.accessToken;
  } catch (error) {
    logTest('User Login', false, null, error);
    return null;
  }
}

// Test 4: Get Current User
async function testGetCurrentUser(token) {
  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Get Current User', true, response.data);
    return true;
  } catch (error) {
    logTest('Get Current User', false, null, error);
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
    logTest('Admin Login', true, { adminId: response.data.admin?.id });
    return response.data.accessToken;
  } catch (error) {
    logTest('Admin Login', false, null, error);
    return null;
  }
}

// Test 6: Contact Form
async function testContactForm() {
  try {
    const response = await axios.post(`${BASE_URL}/contacts`, testContact);
    logTest('Contact Form', true, { contactId: response.data.id });
    return response.data.id;
  } catch (error) {
    logTest('Contact Form', false, null, error);
    return null;
  }
}

// Test 7: Get Contacts (Admin)
async function testGetContacts(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/contacts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Contacts (Admin)', true, { count: response.data.length });
    return true;
  } catch (error) {
    logTest('Get Contacts (Admin)', false, null, error);
    return false;
  }
}

// Test 8: Create Testimonial
async function testCreateTestimonial() {
  try {
    const response = await axios.post(`${BASE_URL}/testimonials`, testTestimonial);
    logTest('Create Testimonial', true, { testimonialId: response.data.id });
    return response.data.id;
  } catch (error) {
    logTest('Create Testimonial', false, null, error);
    return null;
  }
}

// Test 9: Get Testimonials
async function testGetTestimonials() {
  try {
    const response = await axios.get(`${BASE_URL}/testimonials`);
    logTest('Get Testimonials', true, { count: response.data.length });
    return true;
  } catch (error) {
    logTest('Get Testimonials', false, null, error);
    return false;
  }
}

// Test 10: Approve Testimonial (Admin)
async function testApproveTestimonial(testimonialId, adminToken) {
  try {
    const response = await axios.put(`${BASE_URL}/testimonials/${testimonialId}/status`, 
      { status: 'approved' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logTest('Approve Testimonial (Admin)', true, response.data);
    return true;
  } catch (error) {
    logTest('Approve Testimonial (Admin)', false, null, error);
    return false;
  }
}

// Test 11: Create Project (Admin)
async function testCreateProject(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/projects`, testProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Project (Admin)', true, { projectId: response.data.id });
    return response.data.id;
  } catch (error) {
    logTest('Create Project (Admin)', false, null, error);
    return null;
  }
}

// Test 12: Get Projects
async function testGetProjects() {
  try {
    const response = await axios.get(`${BASE_URL}/projects`);
    logTest('Get Projects', true, { count: response.data.length });
    return true;
  } catch (error) {
    logTest('Get Projects', false, null, error);
    return false;
  }
}

// Test 13: Create Blog (Admin)
async function testCreateBlog(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/blogs`, testBlog, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Blog (Admin)', true, { blogId: response.data.id });
    return response.data.id;
  } catch (error) {
    logTest('Create Blog (Admin)', false, null, error);
    return false;
  }
}

// Test 14: Get Blogs
async function testGetBlogs() {
  try {
    const response = await axios.get(`${BASE_URL}/blogs`);
    logTest('Get Blogs', true, { count: response.data.length });
    return true;
  } catch (error) {
    logTest('Get Blogs', false, null, error);
    return false;
  }
}

// Test 15: Get Analytics (Admin)
async function testGetAnalytics(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Analytics (Admin)', true, response.data);
    return true;
  } catch (error) {
    logTest('Get Analytics (Admin)', false, null, error);
    return false;
  }
}

// Test 16: Get All Users (Admin)
async function testGetAllUsers(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get All Users (Admin)', true, { count: response.data.length });
    return true;
  } catch (error) {
    logTest('Get All Users (Admin)', false, null, error);
    return false;
  }
}

// Test 17: User Forgot Password
async function testUserForgotPassword() {
  try {
    const response = await axios.post(`${BASE_URL}/user/forgot-password`, {
      email: testUser.email
    });
    logTest('User Forgot Password', true, response.data);
    return true;
  } catch (error) {
    logTest('User Forgot Password', false, null, error);
    return false;
  }
}

// Test 18: Admin Forgot Password
async function testAdminForgotPassword() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/forgot-password`, {
      email: 'ashishjaiswal0701@gmail.com'
    });
    logTest('Admin Forgot Password', true, response.data);
    return true;
  } catch (error) {
    logTest('Admin Forgot Password', false, null, error);
    return false;
  }
}

// Test 19: User Logout
async function testUserLogout(userToken) {
  try {
    const response = await axios.post(`${BASE_URL}/user/logout`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    logTest('User Logout', true, response.data);
    return true;
  } catch (error) {
    logTest('User Logout', false, null, error);
    return false;
  }
}

// Test 20: Admin Logout
async function testAdminLogout(adminToken) {
  try {
    const response = await axios.post(`${BASE_URL}/admin/logout`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Admin Logout', true, response.data);
    return true;
  } catch (error) {
    logTest('Admin Logout', false, null, error);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting comprehensive endpoint tests...\n');
  
  // Test 1: Health Check
  await testHealthCheck();
  
  // Test 2: User Registration
  const userToken = await testUserRegistration();
  
  // Test 3: User Login (if registration failed)
  const finalUserToken = userToken || await testUserLogin();
  
  // Test 4: Get Current User
  if (finalUserToken) {
    await testGetCurrentUser(finalUserToken);
  }
  
  // Test 5: Admin Login
  const adminToken = await testAdminLogin();
  
  // Test 6: Contact Form
  const contactId = await testContactForm();
  
  // Test 7: Get Contacts (Admin)
  if (adminToken) {
    await testGetContacts(adminToken);
  }
  
  // Test 8: Create Testimonial
  const testimonialId = await testCreateTestimonial();
  
  // Test 9: Get Testimonials
  await testGetTestimonials();
  
  // Test 10: Approve Testimonial (Admin)
  if (testimonialId && adminToken) {
    await testApproveTestimonial(testimonialId, adminToken);
  }
  
  // Test 11: Create Project (Admin)
  const projectId = adminToken ? await testCreateProject(adminToken) : null;
  
  // Test 12: Get Projects
  await testGetProjects();
  
  // Test 13: Create Blog (Admin)
  const blogId = adminToken ? await testCreateBlog(adminToken) : null;
  
  // Test 14: Get Blogs
  await testGetBlogs();
  
  // Test 15: Get Analytics (Admin)
  if (adminToken) {
    await testGetAnalytics(adminToken);
  }
  
  // Test 16: Get All Users (Admin)
  if (adminToken) {
    await testGetAllUsers(adminToken);
  }
  
  // Test 17: User Forgot Password
  await testUserForgotPassword();
  
  // Test 18: Admin Forgot Password
  await testAdminForgotPassword();
  
  // Test 19: User Logout
  if (finalUserToken) {
    await testUserLogout(finalUserToken);
  }
  
  // Test 20: Admin Logout
  if (adminToken) {
    await testAdminLogout(adminToken);
  }
  
  console.log('🎉 All endpoint tests completed!');
}

// Run the tests
runAllTests().catch(console.error); 