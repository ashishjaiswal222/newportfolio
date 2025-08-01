const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('👑 Testing Admin Endpoints...\n');

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

// Test 1: Admin Login
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

// Test 2: Get Analytics
async function testGetAnalytics(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/analytics`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Analytics', true, response);
    return true;
  } catch (error) {
    logTest('Get Analytics', false, null, error);
    return false;
  }
}

// Test 3: Get All Users
async function testGetAllUsers(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get All Users', true, response);
    return response.data;
  } catch (error) {
    logTest('Get All Users', false, null, error);
    return null;
  }
}

// Test 4: Get Admin Profile
async function testGetAdminProfile(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/admin/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Admin Profile', true, response);
    return true;
  } catch (error) {
    logTest('Get Admin Profile', false, null, error);
    return false;
  }
}

// Test 5: Update Admin Profile
async function testUpdateAdminProfile(adminToken) {
  try {
    const updateData = {
      name: 'Ashish Jaiswal (Updated)',
      email: 'ashishjaiswal0701@gmail.com'
    };
    const response = await axios.put(`${BASE_URL}/admin/profile`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Update Admin Profile', true, response);
    return true;
  } catch (error) {
    logTest('Update Admin Profile', false, null, error);
    return false;
  }
}

// Test 6: Get Contacts (Admin)
async function testGetContacts(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/contacts`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Contacts (Admin)', true, response);
    return response.data;
  } catch (error) {
    logTest('Get Contacts (Admin)', false, null, error);
    return null;
  }
}

// Test 7: Update Contact Status
async function testUpdateContactStatus(adminToken, contactId) {
  try {
    const response = await axios.put(`${BASE_URL}/contacts/${contactId}/status`, 
      { status: 'read' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logTest('Update Contact Status', true, response);
    return true;
  } catch (error) {
    logTest('Update Contact Status', false, null, error);
    return false;
  }
}

// Test 8: Get Testimonials (Admin)
async function testGetTestimonialsAdmin(adminToken) {
  try {
    const response = await axios.get(`${BASE_URL}/testimonials`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Get Testimonials (Admin)', true, response);
    return response.data;
  } catch (error) {
    logTest('Get Testimonials (Admin)', false, null, error);
    return false;
  }
}

// Test 9: Approve Testimonial
async function testApproveTestimonial(adminToken, testimonialId) {
  try {
    const response = await axios.put(`${BASE_URL}/testimonials/${testimonialId}/status`, 
      { status: 'approved' },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    logTest('Approve Testimonial', true, response);
    return true;
  } catch (error) {
    logTest('Approve Testimonial', false, null, error);
    return false;
  }
}

// Test 10: Create Project (Admin)
async function testCreateProject(adminToken) {
  try {
    const projectData = {
      title: 'Test Project from Admin',
      description: 'A test project created by admin',
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
    logTest('Create Project (Admin)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Project (Admin)', false, null, error);
    return null;
  }
}

// Test 11: Update Project (Admin)
async function testUpdateProject(adminToken, projectId) {
  try {
    const updateData = {
      title: 'Updated Test Project',
      description: 'Updated description',
      featured: true
    };
    const response = await axios.put(`${BASE_URL}/projects/${projectId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Update Project (Admin)', true, response);
    return true;
  } catch (error) {
    logTest('Update Project (Admin)', false, null, error);
    return false;
  }
}

// Test 12: Create Blog (Admin)
async function testCreateBlog(adminToken) {
  try {
    const blogData = {
      title: 'Test Blog Post from Admin',
      content: '<h2>Test Content</h2><p>This is a test blog post created by admin.</p>',
      excerpt: 'A test excerpt',
      author: 'Ashish Jaiswal',
      categories: ['Technology'],
      tags: ['test', 'admin'],
      status: 'published',
      featured: false
    };
    const response = await axios.post(`${BASE_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Create Blog (Admin)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Create Blog (Admin)', false, null, error);
    return null;
  }
}

// Test 13: Update Blog (Admin)
async function testUpdateBlog(adminToken, blogId) {
  try {
    const updateData = {
      title: 'Updated Test Blog Post',
      content: '<h2>Updated Content</h2><p>This is an updated test blog post.</p>',
      featured: true
    };
    const response = await axios.put(`${BASE_URL}/blogs/${blogId}`, updateData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Update Blog (Admin)', true, response);
    return true;
  } catch (error) {
    logTest('Update Blog (Admin)', false, null, error);
    return false;
  }
}

// Test 14: Admin Forgot Password
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

// Test 15: Admin Logout
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
async function runAdminTests() {
  console.log('🚀 Starting admin endpoint tests...\n');
  
  // Test 1: Admin Login
  const adminToken = await testAdminLogin();
  
  if (!adminToken) {
    console.log('❌ Cannot proceed without admin token');
    return;
  }
  
  // Test 2: Get Analytics
  await testGetAnalytics(adminToken);
  
  // Test 3: Get All Users
  const users = await testGetAllUsers(adminToken);
  
  // Test 4: Get Admin Profile
  await testGetAdminProfile(adminToken);
  
  // Test 5: Update Admin Profile
  await testUpdateAdminProfile(adminToken);
  
  // Test 6: Get Contacts
  const contacts = await testGetContacts(adminToken);
  
  // Test 7: Update Contact Status (if contacts exist)
  if (contacts && contacts.length > 0) {
    await testUpdateContactStatus(adminToken, contacts[0].id);
  }
  
  // Test 8: Get Testimonials
  const testimonials = await testGetTestimonialsAdmin(adminToken);
  
  // Test 9: Approve Testimonial (if testimonials exist)
  if (testimonials && testimonials.length > 0) {
    await testApproveTestimonial(adminToken, testimonials[0].id);
  }
  
  // Test 10: Create Project
  const projectId = await testCreateProject(adminToken);
  
  // Test 11: Update Project
  if (projectId) {
    await testUpdateProject(adminToken, projectId);
  }
  
  // Test 12: Create Blog
  const blogId = await testCreateBlog(adminToken);
  
  // Test 13: Update Blog
  if (blogId) {
    await testUpdateBlog(adminToken, blogId);
  }
  
  // Test 14: Admin Forgot Password
  await testAdminForgotPassword();
  
  // Test 15: Admin Logout
  await testAdminLogout(adminToken);
  
  console.log('🎉 Admin endpoint tests completed!');
}

// Run the tests
runAdminTests().catch(console.error); 