const axios = require('axios');

async function testAuthEndpoints() {
  const baseURL = 'http://localhost:3000';
  
  console.log('Testing authentication endpoints...\n');

  // Test user registration
  try {
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${baseURL}/api/user/register`, {
      email: 'testuser@example.com',
      password: 'testpassword123',
      name: 'Test User'
    });
    console.log('✅ User registration successful:', registerResponse.data.message);
  } catch (error) {
    console.log('❌ User registration failed:', error.response?.data?.message || error.message);
  }

  // Test user login
  try {
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${baseURL}/api/user/login`, {
      email: 'testuser@example.com',
      password: 'testpassword123'
    });
    console.log('✅ User login successful:', loginResponse.data.message);
  } catch (error) {
    console.log('❌ User login failed:', error.response?.data?.message || error.message);
  }

  // Test admin login
  try {
    console.log('\n3. Testing admin login...');
    const adminLoginResponse = await axios.post(`${baseURL}/api/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    console.log('✅ Admin login successful:', adminLoginResponse.data.message);
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
  }

  // Test blog creation with admin token
  try {
    console.log('\n4. Testing blog creation...');
    const adminLoginResponse = await axios.post(`${baseURL}/api/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const token = adminLoginResponse.data.token;
    const blogResponse = await axios.post(`${baseURL}/api/blogs`, {
      title: 'Test Blog Post',
      content: 'This is a test blog post content.',
      excerpt: 'A test blog post excerpt.',
      categories: ['Test Category'],
      tags: ['test', 'blog'],
      status: 'published',
      author: 'ashishjaiswal0701@gmail.com'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Blog creation successful:', blogResponse.data.blog.id);
  } catch (error) {
    console.log('❌ Blog creation failed:', error.response?.data?.message || error.message);
  }
}

testAuthEndpoints(); 