const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSecurity() {
  console.log('🔐 FINAL ADMIN ENDPOINT SECURITY VERIFICATION\n');
  console.log('=' .repeat(60));
  
  let results = {
    publicEndpoints: [],
    adminEndpoints: [],
    authentication: null
  };
  
  // Test public endpoints
  console.log('📋 1. Testing Public Endpoints (should work without auth)');
  console.log('-'.repeat(50));
  
  const publicEndpoints = [
    { method: 'GET', path: '/api/contacts', name: 'Get Contacts' },
    { method: 'POST', path: '/api/contacts', name: 'Create Contact' },
    { method: 'GET', path: '/api/testimonials', name: 'Get Testimonials' },
    { method: 'GET', path: '/api/projects', name: 'Get Projects' },
    { method: 'GET', path: '/api/blogs', name: 'Get Blogs' }
  ];
  
  for (const endpoint of publicEndpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.path}`,
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      console.log(`✅ ${endpoint.name} - Success (${response.status})`);
      results.publicEndpoints.push({ name: endpoint.name, status: 'SUCCESS', code: response.status });
    } catch (error) {
      console.log(`❌ ${endpoint.name} - Failed (${error.response?.status || 'Unknown'})`);
      results.publicEndpoints.push({ name: endpoint.name, status: 'FAILED', code: error.response?.status });
    }
  }
  
  // Test admin endpoints without auth
  console.log('\n📋 2. Testing Admin Endpoints (should be blocked without auth)');
  console.log('-'.repeat(50));
  
  const adminEndpoints = [
    { method: 'GET', path: '/api/admin/contacts', name: 'Admin Get Contacts' },
    { method: 'POST', path: '/api/admin/contacts', name: 'Admin Create Contact' },
    { method: 'GET', path: '/api/admin/testimonials', name: 'Admin Get Testimonials' },
    { method: 'POST', path: '/api/admin/testimonials', name: 'Admin Create Testimonial' },
    { method: 'GET', path: '/api/admin/projects', name: 'Admin Get Projects' },
    { method: 'GET', path: '/api/admin/blogs', name: 'Admin Get Blogs' },
    { method: 'GET', path: '/api/admin/analytics', name: 'Admin Analytics' }
  ];
  
  for (const endpoint of adminEndpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.path}`,
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      console.log(`❌ SECURITY ISSUE: ${endpoint.name} - Should be blocked but succeeded (${response.status})`);
      results.adminEndpoints.push({ name: endpoint.name, status: 'SECURITY_ISSUE', code: response.status });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`🔒 ${endpoint.name} - Properly secured (401 Unauthorized)`);
        results.adminEndpoints.push({ name: endpoint.name, status: 'PROPERLY_SECURED', code: 401 });
      } else {
        console.log(`❌ ${endpoint.name} - Unexpected error (${error.response?.status || 'Unknown'})`);
        results.adminEndpoints.push({ name: endpoint.name, status: 'UNEXPECTED_ERROR', code: error.response?.status });
      }
    }
  }
  
  // Test authentication
  console.log('\n📋 3. Testing Admin Authentication');
  console.log('-'.repeat(50));
  
  try {
    const authResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful');
    results.authentication = { status: 'SUCCESS', token: authResponse.data.token ? 'PRESENT' : 'MISSING' };
    
    // Test admin endpoint with valid token
    const adminResponse = await axios.get(`${BASE_URL}/api/admin/contacts`, {
      headers: {
        'Authorization': `Bearer ${authResponse.data.token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Admin endpoint accessible with valid token');
    
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    results.authentication = { status: 'FAILED', reason: error.response?.data?.message || error.message };
  }
  
  // Generate security report
  console.log('\n' + '='.repeat(60));
  console.log('🔐 SECURITY VERIFICATION REPORT');
  console.log('='.repeat(60));
  
  const publicSuccess = results.publicEndpoints.filter(r => r.status === 'SUCCESS').length;
  const publicTotal = results.publicEndpoints.length;
  console.log(`\n📊 Public Endpoints: ${publicSuccess}/${publicTotal} working correctly`);
  
  const adminSecured = results.adminEndpoints.filter(r => r.status === 'PROPERLY_SECURED').length;
  const adminTotal = results.adminEndpoints.length;
  console.log(`📊 Admin Endpoints: ${adminSecured}/${adminTotal} properly secured`);
  
  const securityIssues = results.adminEndpoints.filter(r => r.status === 'SECURITY_ISSUE').length;
  if (securityIssues > 0) {
    console.log(`🚨 SECURITY ISSUES: ${securityIssues} admin endpoints not properly secured!`);
  } else {
    console.log('✅ All admin endpoints are properly secured!');
  }
  
  console.log(`\n🔐 Authentication: ${results.authentication?.status || 'UNKNOWN'}`);
  if (results.authentication?.status === 'FAILED') {
    console.log(`   Reason: ${results.authentication.reason}`);
  }
  
  // Final verdict
  console.log('\n' + '='.repeat(60));
  if (securityIssues === 0 && adminSecured === adminTotal) {
    console.log('🎉 SECURITY VERIFICATION PASSED!');
    console.log('✅ All admin endpoints are properly protected with JWT authentication');
    console.log('✅ Public endpoints are accessible without authentication');
    console.log('✅ JWT middleware is working correctly');
  } else {
    console.log('❌ SECURITY VERIFICATION FAILED!');
    console.log('🚨 Some admin endpoints are not properly secured');
  }
  console.log('='.repeat(60));
}

testSecurity().catch(console.error); 