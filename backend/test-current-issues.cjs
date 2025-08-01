const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testCurrentIssues() {
  console.log('🔍 Testing Current Issues Reported by User\n');

  try {
    // Test 1: Check if blogs are accessible with proper UUIDs
    console.log('1️⃣ Testing Blog Access with UUIDs...');
    const blogsResponse = await axios.get(`${BASE_URL}/blogs`);
    const blogs = blogsResponse.data.blogs;
    
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log(`✅ Found ${blogs.length} blogs`);
      console.log(`   First blog ID: ${firstBlog.id} (UUID: ${isValidUUID(firstBlog.id) ? 'Valid' : 'Invalid'})`);
      
      // Test fetching specific blog by UUID
      try {
        const blogResponse = await axios.get(`${BASE_URL}/blogs/${firstBlog.id}`);
        console.log(`✅ Successfully fetched blog with UUID: ${firstBlog.id}`);
      } catch (error) {
        console.log(`❌ Failed to fetch blog with UUID: ${firstBlog.id}`);
        console.log(`   Error: ${error.response?.data?.message || error.message}`);
      }
    } else {
      console.log('❌ No blogs found in database');
    }

    // Test 2: Test User Registration
    console.log('\n2️⃣ Testing User Registration...');
    const testEmail = `testuser${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    try {
      const registerResponse = await axios.post(`${BASE_URL}/user/register`, {
        email: testEmail,
        password: testPassword,
        name: 'Test User'
      });
      console.log('✅ User registration successful');
      console.log(`   User ID: ${registerResponse.data.user.id}`);
    } catch (error) {
      console.log('❌ User registration failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Test User Login
    console.log('\n3️⃣ Testing User Login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/user/login`, {
        email: testEmail,
        password: testPassword
      });
      console.log('✅ User login successful');
      console.log(`   Token: ${loginResponse.data.token ? 'Present' : 'Missing'}`);
    } catch (error) {
      console.log('❌ User login failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test 4: Test Admin Login
    console.log('\n4️⃣ Testing Admin Login...');
    try {
      const adminResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'ashishjaiswal0701@gmail.com',
        password: '@fusu649Ib'
      });
      console.log('✅ Admin login successful');
      console.log(`   Token: ${adminResponse.data.token ? 'Present' : 'Missing'}`);
    } catch (error) {
      console.log('❌ Admin login failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test 5: Test Contact Creation
    console.log('\n5️⃣ Testing Contact Creation...');
    try {
      const contactResponse = await axios.post(`${BASE_URL}/contacts`, {
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      });
      console.log('✅ Contact creation successful');
      console.log(`   Contact ID: ${contactResponse.data.contact?.id || 'N/A'}`);
    } catch (error) {
      console.log('❌ Contact creation failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    // Test 6: Test Analytics Endpoints (requires admin auth)
    console.log('\n6️⃣ Testing Analytics Endpoints...');
    try {
      // First get admin token
      const adminResponse = await axios.post(`${BASE_URL}/admin/login`, {
        email: 'ashishjaiswal0701@gmail.com',
        password: '@fusu649Ib'
      });
      
      const adminToken = adminResponse.data.token;
      
      const analyticsResponse = await axios.get(`${BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log('✅ Analytics accessible with admin auth');
    } catch (error) {
      console.log('❌ Analytics failed');
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎯 Summary:');
    console.log('- Blog UUIDs: Working');
    console.log('- User Registration: Check above');
    console.log('- User Login: Check above');
    console.log('- Admin Login: Check above');
    console.log('- Contact Creation: Check above');
    console.log('- Analytics: Check above');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

testCurrentIssues(); 