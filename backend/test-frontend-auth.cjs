const axios = require('axios');

async function testFrontendAuth() {
  const baseURL = 'http://localhost:3000';
  
  console.log('Testing frontend authentication simulation...\n');

  // Test admin login (simulating frontend call)
  try {
    console.log('1. Testing admin login (frontend simulation)...');
    const adminLoginResponse = await axios.post(`${baseURL}/api/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    console.log('✅ Admin login successful');
    console.log('Token received:', adminLoginResponse.data.token ? 'Yes' : 'No');
    console.log('User data received:', adminLoginResponse.data.user ? 'Yes' : 'No');
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
  }

  // Test user registration (simulating frontend call)
  try {
    console.log('\n2. Testing user registration (frontend simulation)...');
    const registerResponse = await axios.post(`${baseURL}/api/user/register`, {
      email: 'newuser@example.com',
      password: 'newpassword123',
      name: 'New User'
    });
    console.log('✅ User registration successful:', registerResponse.data.message);
  } catch (error) {
    console.log('❌ User registration failed:', error.response?.data?.message || error.message);
  }

  // Test user login (simulating frontend call)
  try {
    console.log('\n3. Testing user login (frontend simulation)...');
    const loginResponse = await axios.post(`${baseURL}/api/user/login`, {
      email: 'newuser@example.com',
      password: 'newpassword123'
    });
    console.log('✅ User login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('User data received:', loginResponse.data.user ? 'Yes' : 'No');
  } catch (error) {
    console.log('❌ User login failed:', error.response?.data?.message || error.message);
  }

  // Test blog fetching (simulating frontend call)
  try {
    console.log('\n4. Testing blog fetching (frontend simulation)...');
    const blogsResponse = await axios.get(`${baseURL}/api/blogs`);
    console.log('✅ Blog fetching successful');
    console.log('Blogs count:', blogsResponse.data.blogs?.length || 0);
    
    if (blogsResponse.data.blogs?.length > 0) {
      const firstBlogId = blogsResponse.data.blogs[0].id;
      console.log('First blog ID:', firstBlogId);
      
      // Test fetching specific blog
      const blogResponse = await axios.get(`${baseURL}/api/blogs/${firstBlogId}`);
      console.log('✅ Specific blog fetch successful');
    }
  } catch (error) {
    console.log('❌ Blog fetching failed:', error.response?.data?.message || error.message);
  }
}

testFrontendAuth(); 