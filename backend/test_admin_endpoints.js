const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = null;

// Test data
const testContact = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '1234567890',
  subject: 'Test Subject',
  message: 'Test message for admin endpoint testing',
  source: 'test'
};

const testTestimonial = {
  name: 'Test User',
  role: 'Test Role',
  company: 'Test Company',
  content: 'Test testimonial content',
  rating: 5,
  avatar: 'https://example.com/avatar.jpg'
};

const testProject = {
  title: 'Test Project',
  description: 'Test project description',
  image: 'https://example.com/image.jpg',
  technologies: ['React', 'Node.js'],
  githubUrl: 'https://github.com/test',
  liveUrl: 'https://test.com',
  featured: true
};

const testBlog = {
  title: 'Test Blog Post',
  content: 'Test blog content',
  excerpt: 'Test excerpt',
  tags: ['test', 'blog'],
  published: true
};

async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: 'admin123'
    });
    authToken = response.data.token;
    console.log('✅ Login successful!');
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testEndpoint(method, endpoint, data = null, description = '') {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    console.log(`✅ ${description} - Success (${response.status})`);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(`🔒 ${description} - Properly secured (401 Unauthorized)`);
      return { success: false, secured: true };
    } else {
      console.log(`❌ ${description} - Error (${error.response?.status}): ${error.response?.data?.message || error.message}`);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
}

async function testWithoutAuth() {
  console.log('\n🔒 Testing endpoints WITHOUT authentication...');
  
  // Test all admin endpoints without token
  await testEndpoint('GET', '/api/admin/contacts', null, 'Get contacts without auth');
  await testEndpoint('POST', '/api/admin/contacts', testContact, 'Create contact without auth');
  await testEndpoint('PUT', '/api/admin/contacts/1', testContact, 'Update contact without auth');
  await testEndpoint('DELETE', '/api/admin/contacts/1', null, 'Delete contact without auth');
  
  await testEndpoint('GET', '/api/admin/testimonials', null, 'Get testimonials without auth');
  await testEndpoint('POST', '/api/admin/testimonials', testTestimonial, 'Create testimonial without auth');
  await testEndpoint('PUT', '/api/admin/testimonials/1', testTestimonial, 'Update testimonial without auth');
  await testEndpoint('DELETE', '/api/admin/testimonials/1', null, 'Delete testimonial without auth');
  
  await testEndpoint('GET', '/api/admin/projects', null, 'Get projects without auth');
  await testEndpoint('POST', '/api/admin/projects', testProject, 'Create project without auth');
  await testEndpoint('PUT', '/api/admin/projects/1', testProject, 'Update project without auth');
  await testEndpoint('DELETE', '/api/admin/projects/1', null, 'Delete project without auth');
  
  await testEndpoint('GET', '/api/admin/blogs', null, 'Get blogs without auth');
  await testEndpoint('POST', '/api/admin/blogs', testBlog, 'Create blog without auth');
  await testEndpoint('PUT', '/api/admin/blogs/1', testBlog, 'Update blog without auth');
  await testEndpoint('DELETE', '/api/admin/blogs/1', null, 'Delete blog without auth');
  
  await testEndpoint('GET', '/api/admin/analytics', null, 'Get analytics without auth');
  await testEndpoint('GET', '/api/admin/analytics/contacts', null, 'Get contact analytics without auth');
  await testEndpoint('GET', '/api/admin/analytics/testimonials', null, 'Get testimonial analytics without auth');
}

async function testWithAuth() {
  console.log('\n🔓 Testing endpoints WITH authentication...');
  
  // Test all admin endpoints with token
  await testEndpoint('GET', '/api/admin/contacts', null, 'Get contacts with auth');
  await testEndpoint('POST', '/api/admin/contacts', testContact, 'Create contact with auth');
  
  // Get the created contact ID for update/delete tests
  const contactsResponse = await testEndpoint('GET', '/api/admin/contacts', null, 'Get contacts for ID');
  if (contactsResponse.success && contactsResponse.data.length > 0) {
    const contactId = contactsResponse.data[0].id;
    await testEndpoint('PUT', `/api/admin/contacts/${contactId}`, testContact, 'Update contact with auth');
    await testEndpoint('DELETE', `/api/admin/contacts/${contactId}`, null, 'Delete contact with auth');
  }
  
  await testEndpoint('GET', '/api/admin/testimonials', null, 'Get testimonials with auth');
  await testEndpoint('POST', '/api/admin/testimonials', testTestimonial, 'Create testimonial with auth');
  
  const testimonialsResponse = await testEndpoint('GET', '/api/admin/testimonials', null, 'Get testimonials for ID');
  if (testimonialsResponse.success && testimonialsResponse.data.length > 0) {
    const testimonialId = testimonialsResponse.data[0].id;
    await testEndpoint('PUT', `/api/admin/testimonials/${testimonialId}`, testTestimonial, 'Update testimonial with auth');
    await testEndpoint('DELETE', `/api/admin/testimonials/${testimonialId}`, null, 'Delete testimonial with auth');
  }
  
  await testEndpoint('GET', '/api/admin/projects', null, 'Get projects with auth');
  await testEndpoint('POST', '/api/admin/projects', testProject, 'Create project with auth');
  
  const projectsResponse = await testEndpoint('GET', '/api/admin/projects', null, 'Get projects for ID');
  if (projectsResponse.success && projectsResponse.data.length > 0) {
    const projectId = projectsResponse.data[0].id;
    await testEndpoint('PUT', `/api/admin/projects/${projectId}`, testProject, 'Update project with auth');
    await testEndpoint('DELETE', `/api/admin/projects/${projectId}`, null, 'Delete project with auth');
  }
  
  await testEndpoint('GET', '/api/admin/blogs', null, 'Get blogs with auth');
  await testEndpoint('POST', '/api/admin/blogs', testBlog, 'Create blog with auth');
  
  const blogsResponse = await testEndpoint('GET', '/api/admin/blogs', null, 'Get blogs for ID');
  if (blogsResponse.success && blogsResponse.data.length > 0) {
    const blogId = blogsResponse.data[0].id;
    await testEndpoint('PUT', `/api/admin/blogs/${blogId}`, testBlog, 'Update blog with auth');
    await testEndpoint('DELETE', `/api/admin/blogs/${blogId}`, null, 'Delete blog with auth');
  }
  
  await testEndpoint('GET', '/api/admin/analytics', null, 'Get analytics with auth');
  await testEndpoint('GET', '/api/admin/analytics/contacts', null, 'Get contact analytics with auth');
  await testEndpoint('GET', '/api/admin/analytics/testimonials', null, 'Get testimonial analytics with auth');
}

async function testInvalidToken() {
  console.log('\n🚫 Testing endpoints with invalid token...');
  
  // Temporarily set invalid token
  const originalToken = authToken;
  authToken = 'invalid.token.here';
  
  await testEndpoint('GET', '/api/admin/contacts', null, 'Get contacts with invalid token');
  await testEndpoint('GET', '/api/admin/testimonials', null, 'Get testimonials with invalid token');
  await testEndpoint('GET', '/api/admin/projects', null, 'Get projects with invalid token');
  await testEndpoint('GET', '/api/admin/blogs', null, 'Get blogs with invalid token');
  await testEndpoint('GET', '/api/admin/analytics', null, 'Get analytics with invalid token');
  
  // Restore original token
  authToken = originalToken;
}

async function testPublicEndpoints() {
  console.log('\n🌐 Testing public endpoints (should work without auth)...');
  
  await testEndpoint('GET', '/api/contacts', null, 'Get public contacts');
  await testEndpoint('POST', '/api/contacts', testContact, 'Create public contact');
  await testEndpoint('GET', '/api/testimonials', null, 'Get public testimonials');
  await testEndpoint('GET', '/api/projects', null, 'Get public projects');
  await testEndpoint('GET', '/api/blogs', null, 'Get public blogs');
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive admin endpoint security tests...\n');
  
  // Test public endpoints first
  await testPublicEndpoints();
  
  // Test admin endpoints without authentication
  await testWithoutAuth();
  
  // Login to get valid token
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed with authenticated tests without valid login');
    return;
  }
  
  // Test admin endpoints with invalid token
  await testInvalidToken();
  
  // Test admin endpoints with valid authentication
  await testWithAuth();
  
  console.log('\n🎉 All admin endpoint security tests completed!');
  console.log('\n📋 Summary:');
  console.log('✅ Public endpoints should work without authentication');
  console.log('🔒 Admin endpoints should be blocked without authentication (401)');
  console.log('🚫 Admin endpoints should be blocked with invalid tokens (401)');
  console.log('🔓 Admin endpoints should work with valid authentication');
}

// Run the tests
runAllTests().catch(console.error); 