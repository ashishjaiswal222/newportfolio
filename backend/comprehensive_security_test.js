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

async function testEndpoint(method, endpoint, data = null, description = '', expectAuth = false) {
  try {
    console.log(`\n🔍 ${description}...`);
    
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    };

    if (authToken && expectAuth) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    
    if (expectAuth && !authToken) {
      console.log(`❌ Security Issue: ${description} - Should require auth but succeeded (${response.status})`);
      return { success: false, securityIssue: true };
    } else {
      console.log(`✅ ${description} - Success (${response.status})`);
      return { success: true, data: response.data };
    }
  } catch (error) {
    if (error.response?.status === 401) {
      if (expectAuth && !authToken) {
        console.log(`🔒 ${description} - Properly secured (401 Unauthorized)`);
        return { success: false, secured: true };
      } else if (expectAuth && authToken) {
        console.log(`❌ ${description} - Auth failed despite valid token (401)`);
        return { success: false, authFailed: true };
      } else {
        console.log(`❌ ${description} - Unexpected 401 for public endpoint`);
        return { success: false, unexpected401: true };
      }
    } else {
      console.log(`❌ ${description} - Error (${error.response?.status || 'Unknown'}): ${error.response?.data?.message || error.message}`);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
}

async function login() {
  try {
    console.log('\n🔐 Attempting admin login...');
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

async function runComprehensiveTests() {
  console.log('🚀 Starting comprehensive admin endpoint security tests...\n');
  
  // Test 1: Public endpoints (should work without auth)
  console.log('📋 Test 1: Public Endpoints (should work without auth)');
  console.log('=' .repeat(50));
  
  await testEndpoint('GET', '/api/contacts', null, 'Get public contacts', false);
  await testEndpoint('POST', '/api/contacts', testContact, 'Create public contact', false);
  await testEndpoint('GET', '/api/testimonials', null, 'Get public testimonials', false);
  await testEndpoint('GET', '/api/projects', null, 'Get public projects', false);
  await testEndpoint('GET', '/api/blogs', null, 'Get public blogs', false);
  
  // Test 2: Admin endpoints without auth (should fail with 401)
  console.log('\n📋 Test 2: Admin Endpoints Without Auth (should fail with 401)');
  console.log('=' .repeat(50));
  
  await testEndpoint('GET', '/api/admin/contacts', null, 'Get admin contacts without auth', true);
  await testEndpoint('POST', '/api/admin/contacts', testContact, 'Create admin contact without auth', true);
  await testEndpoint('PUT', '/api/admin/contacts/1', testContact, 'Update admin contact without auth', true);
  await testEndpoint('DELETE', '/api/admin/contacts/1', null, 'Delete admin contact without auth', true);
  
  await testEndpoint('GET', '/api/admin/testimonials', null, 'Get admin testimonials without auth', true);
  await testEndpoint('POST', '/api/admin/testimonials', testTestimonial, 'Create admin testimonial without auth', true);
  await testEndpoint('PUT', '/api/admin/testimonials/1', testTestimonial, 'Update admin testimonial without auth', true);
  await testEndpoint('DELETE', '/api/admin/testimonials/1', null, 'Delete admin testimonial without auth', true);
  
  await testEndpoint('GET', '/api/admin/projects', null, 'Get admin projects without auth', true);
  await testEndpoint('POST', '/api/admin/projects', testContact, 'Create admin project without auth', true);
  await testEndpoint('PUT', '/api/admin/projects/1', testContact, 'Update admin project without auth', true);
  await testEndpoint('DELETE', '/api/admin/projects/1', null, 'Delete admin project without auth', true);
  
  await testEndpoint('GET', '/api/admin/blogs', null, 'Get admin blogs without auth', true);
  await testEndpoint('POST', '/api/admin/blogs', testContact, 'Create admin blog without auth', true);
  await testEndpoint('PUT', '/api/admin/blogs/1', testContact, 'Update admin blog without auth', true);
  await testEndpoint('DELETE', '/api/admin/blogs/1', null, 'Delete admin blog without auth', true);
  
  await testEndpoint('GET', '/api/admin/analytics', null, 'Get admin analytics without auth', true);
  await testEndpoint('GET', '/api/admin/analytics/contacts', null, 'Get admin contact analytics without auth', true);
  await testEndpoint('GET', '/api/admin/analytics/testimonials', null, 'Get admin testimonial analytics without auth', true);
  
  // Test 3: Try to login
  console.log('\n📋 Test 3: Admin Authentication');
  console.log('=' .repeat(50));
  
  const loginSuccess = await login();
  
  if (loginSuccess) {
    // Test 4: Admin endpoints with valid auth (should work)
    console.log('\n📋 Test 4: Admin Endpoints With Valid Auth (should work)');
    console.log('=' .repeat(50));
    
    await testEndpoint('GET', '/api/admin/contacts', null, 'Get admin contacts with auth', true);
    await testEndpoint('GET', '/api/admin/testimonials', null, 'Get admin testimonials with auth', true);
    await testEndpoint('GET', '/api/admin/projects', null, 'Get admin projects with auth', true);
    await testEndpoint('GET', '/api/admin/blogs', null, 'Get admin blogs with auth', true);
    await testEndpoint('GET', '/api/admin/analytics', null, 'Get admin analytics with auth', true);
    
    // Test 5: Admin endpoints with invalid token
    console.log('\n📋 Test 5: Admin Endpoints With Invalid Token (should fail)');
    console.log('=' .repeat(50));
    
    const originalToken = authToken;
    authToken = 'invalid.token.here';
    
    await testEndpoint('GET', '/api/admin/contacts', null, 'Get admin contacts with invalid token', true);
    await testEndpoint('GET', '/api/admin/testimonials', null, 'Get admin testimonials with invalid token', true);
    await testEndpoint('GET', '/api/admin/projects', null, 'Get admin projects with invalid token', true);
    await testEndpoint('GET', '/api/admin/blogs', null, 'Get admin blogs with invalid token', true);
    await testEndpoint('GET', '/api/admin/analytics', null, 'Get admin analytics with invalid token', true);
    
    authToken = originalToken;
  }
  
  console.log('\n🎉 Comprehensive security tests completed!');
  console.log('\n📋 Security Summary:');
  console.log('✅ Public endpoints should work without authentication');
  console.log('🔒 Admin endpoints should be blocked without authentication (401)');
  console.log('🚫 Admin endpoints should be blocked with invalid tokens (401)');
  console.log('🔓 Admin endpoints should work with valid authentication');
  
  if (!loginSuccess) {
    console.log('\n⚠️  Note: Admin login failed - this may indicate:');
    console.log('   - Admin credentials not in database');
    console.log('   - Incorrect password');
    console.log('   - Database connection issues');
  }
}

runComprehensiveTests().catch(console.error); 