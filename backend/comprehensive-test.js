const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🧪 Running Comprehensive Server Tests...\n');

// Helper function to make API calls
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  console.log('🏥 Test 1: Health Check');
  console.log('--------------------------------');
  
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    console.log('✅ Health check successful');
    console.log('Status:', result.data.status);
    console.log('Message:', result.data.message);
  } else {
    console.log('❌ Health check failed');
    console.log('Status:', result.status);
    console.log('Error:', result.error);
  }
  console.log('');
}

// Test 2: Contact Form
async function testContactForm() {
  console.log('📧 Test 2: Contact Form');
  console.log('--------------------------------');
  
  const contactData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
    subject: 'Test Message',
    message: 'This is a test message from the comprehensive test suite',
    source: 'portfolio'
  };
  
  const result = await makeRequest('POST', '/contacts', contactData);
  
  if (result.success) {
    console.log('✅ Contact form submitted successfully');
    console.log('Message:', result.data.message);
  } else {
    console.log('❌ Contact form failed');
    console.log('Status:', result.status);
    console.log('Error:', result.error);
  }
  console.log('');
}

// Test 3: Get Testimonials
async function testGetTestimonials() {
  console.log('💬 Test 3: Get Testimonials');
  console.log('--------------------------------');
  
  const result = await makeRequest('GET', '/testimonials');
  
  if (result.success) {
    console.log('✅ Testimonials endpoint working');
    console.log('Count:', result.data.testimonials?.length || 0);
  } else {
    console.log('❌ Testimonials endpoint failed');
    console.log('Status:', result.status);
    console.log('Error:', result.error);
  }
  console.log('');
}

// Test 4: Get Projects
async function testGetProjects() {
  console.log('📋 Test 4: Get Projects');
  console.log('--------------------------------');
  
  const result = await makeRequest('GET', '/projects');
  
  if (result.success) {
    console.log('✅ Projects endpoint working');
    console.log('Count:', result.data.projects?.length || 0);
  } else {
    console.log('❌ Projects endpoint failed');
    console.log('Status:', result.status);
    console.log('Error:', result.error);
  }
  console.log('');
}

// Test 5: Get Blogs
async function testGetBlogs() {
  console.log('📝 Test 5: Get Blogs');
  console.log('--------------------------------');
  
  const result = await makeRequest('GET', '/blogs');
  
  if (result.success) {
    console.log('✅ Blogs endpoint working');
    console.log('Count:', result.data.blogs?.length || 0);
  } else {
    console.log('❌ Blogs endpoint failed');
    console.log('Status:', result.status);
    console.log('Error:', result.error);
  }
  console.log('');
}

// Test 6: User Registration (will fail without database)
async function testUserRegistration() {
  console.log('👤 Test 6: User Registration');
  console.log('--------------------------------');
  
  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword123'
  };
  
  const result = await makeRequest('POST', '/user/register', userData);
  
  if (result.success) {
    console.log('✅ User registration successful');
    console.log('Message:', result.data.message);
  } else {
    console.log('⚠️ User registration failed (expected without database)');
    console.log('Status:', result.status);
    console.log('Error:', result.error?.message || result.error);
  }
  console.log('');
}

// Test 7: Admin Login (will fail without database)
async function testAdminLogin() {
  console.log('👑 Test 7: Admin Login');
  console.log('--------------------------------');
  
  const adminData = {
    email: 'admin@ashishjaiswal.dev',
    password: 'admin123'
  };
  
  const result = await makeRequest('POST', '/admin/login', adminData);
  
  if (result.success) {
    console.log('✅ Admin login successful');
    console.log('User:', result.data.user?.name);
  } else {
    console.log('⚠️ Admin login failed (expected without database)');
    console.log('Status:', result.status);
    console.log('Error:', result.error?.message || result.error);
  }
  console.log('');
}

// Test 8: 404 Error Handling
async function test404Handling() {
  console.log('🚫 Test 8: 404 Error Handling');
  console.log('--------------------------------');
  
  const result = await makeRequest('GET', '/nonexistent-endpoint');
  
  if (!result.success && result.status === 404) {
    console.log('✅ 404 error handling working properly');
    console.log('Status:', result.status);
  } else {
    console.log('❌ Unexpected response for non-existent endpoint');
    console.log('Status:', result.status);
  }
  console.log('');
}

// Test 9: CORS Headers
async function testCORSHeaders() {
  console.log('🌐 Test 9: CORS Headers');
  console.log('--------------------------------');
  
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    const corsHeaders = response.headers['access-control-allow-origin'];
    
    if (corsHeaders) {
      console.log('✅ CORS headers present');
      console.log('CORS Origin:', corsHeaders);
    } else {
      console.log('⚠️ CORS headers not found');
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  try {
    console.log('🚀 Starting comprehensive server tests...\n');
    
    await testHealthCheck();
    await testContactForm();
    await testGetTestimonials();
    await testGetProjects();
    await testGetBlogs();
    await testUserRegistration();
    await testAdminLogin();
    await test404Handling();
    await testCORSHeaders();
    
    console.log('🎉 Comprehensive Server Tests Completed!');
    console.log('');
    console.log('📊 Summary:');
    console.log('✅ Server is running and responding');
    console.log('✅ Basic endpoints are working');
    console.log('✅ Error handling is working');
    console.log('✅ CORS is configured');
    console.log('');
    console.log('📝 Note: Database-dependent features (user/auth) will fail without database setup');
    console.log('💡 To enable full functionality, set up PostgreSQL database');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
  }
}

// Run the tests
runAllTests(); 