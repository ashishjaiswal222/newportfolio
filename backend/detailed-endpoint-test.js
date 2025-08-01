const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🔍 Detailed Endpoint Testing...\n');

// Test data
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
    console.log(`   Error Data:`, JSON.stringify(error.response?.data || error.message, null, 2));
  }
  console.log('');
}

// Test 1: Get Testimonials (Detailed)
async function testGetTestimonialsDetailed() {
  try {
    const response = await axios.get(`${BASE_URL}/testimonials`);
    logDetailedTest('Get Testimonials (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Get Testimonials (Detailed)', false, null, error);
    return null;
  }
}

// Test 2: Create Testimonial (Detailed)
async function testCreateTestimonialDetailed() {
  try {
    console.log('📝 Sending testimonial data:', JSON.stringify(testTestimonial, null, 2));
    const response = await axios.post(`${BASE_URL}/testimonials`, testTestimonial);
    logDetailedTest('Create Testimonial (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Create Testimonial (Detailed)', false, null, error);
    return null;
  }
}

// Test 3: Get Projects (Detailed)
async function testGetProjectsDetailed() {
  try {
    const response = await axios.get(`${BASE_URL}/projects`);
    logDetailedTest('Get Projects (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Get Projects (Detailed)', false, null, error);
    return null;
  }
}

// Test 4: Get Blogs (Detailed)
async function testGetBlogsDetailed() {
  try {
    const response = await axios.get(`${BASE_URL}/blogs`);
    logDetailedTest('Get Blogs (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Get Blogs (Detailed)', false, null, error);
    return false;
  }
}

// Test 5: Admin Login (Detailed)
async function testAdminLoginDetailed() {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    logDetailedTest('Admin Login (Detailed)', true, response);
    return response.data.accessToken;
  } catch (error) {
    logDetailedTest('Admin Login (Detailed)', false, null, error);
    return null;
  }
}

// Test 6: Create Project with Admin (Detailed)
async function testCreateProjectWithAdmin(adminToken) {
  try {
    console.log('📝 Sending project data:', JSON.stringify(testProject, null, 2));
    const response = await axios.post(`${BASE_URL}/projects`, testProject, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Create Project with Admin (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Create Project with Admin (Detailed)', false, null, error);
    return null;
  }
}

// Test 7: Create Blog with Admin (Detailed)
async function testCreateBlogWithAdmin(adminToken) {
  try {
    console.log('📝 Sending blog data:', JSON.stringify(testBlog, null, 2));
    const response = await axios.post(`${BASE_URL}/blogs`, testBlog, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Create Blog with Admin (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Create Blog with Admin (Detailed)', false, null, error);
    return null;
  }
}

// Test 8: Get Analytics (Detailed)
async function testGetAnalyticsDetailed(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Get Analytics (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Get Analytics (Detailed)', false, null, error);
    return null;
  }
}

// Test 9: Get All Users (Detailed)
async function testGetAllUsersDetailed(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logDetailedTest('Get All Users (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Get All Users (Detailed)', false, null, error);
    return null;
  }
}

// Test 10: Contact Form (Detailed)
async function testContactFormDetailed() {
  try {
    const contactData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message'
    };
    console.log('📝 Sending contact data:', JSON.stringify(contactData, null, 2));
    const response = await axios.post(`${BASE_URL}/contacts`, contactData);
    logDetailedTest('Contact Form (Detailed)', true, response);
    return response.data;
  } catch (error) {
    logDetailedTest('Contact Form (Detailed)', false, null, error);
    return null;
  }
}

// Main test runner
async function runDetailedTests() {
  console.log('🚀 Starting detailed endpoint tests...\n');
  
  // Test 1: Get Testimonials
  await testGetTestimonialsDetailed();
  
  // Test 2: Create Testimonial
  await testCreateTestimonialDetailed();
  
  // Test 3: Get Projects
  await testGetProjectsDetailed();
  
  // Test 4: Get Blogs
  await testGetBlogsDetailed();
  
  // Test 5: Admin Login
  const adminToken = await testAdminLoginDetailed();
  
  // Test 6: Create Project with Admin
  if (adminToken) {
    await testCreateProjectWithAdmin(adminToken);
  }
  
  // Test 7: Create Blog with Admin
  if (adminToken) {
    await testCreateBlogWithAdmin(adminToken);
  }
  
  // Test 8: Get Analytics
  if (adminToken) {
    await testGetAnalyticsDetailed(adminToken);
  }
  
  // Test 9: Get All Users
  if (adminToken) {
    await testGetAllUsersDetailed(adminToken);
  }
  
  // Test 10: Contact Form
  await testContactFormDetailed();
  
  console.log('🎉 Detailed endpoint tests completed!');
}

// Run the tests
runDetailedTests().catch(console.error); 