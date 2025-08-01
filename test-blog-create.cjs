const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testBlogCreate() {
  try {
    console.log('🧪 Testing Blog Creation...\n');
    
    // 1. Admin Login
    console.log('1. Admin Login...');
    const loginResponse = await axios.post(`${API_BASE}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // 2. Create Blog
    console.log('\n2. Creating Blog...');
    const blogData = {
      title: 'Simple Test Blog',
      excerpt: 'A simple test blog post',
      content: '<h1>Test Content</h1><p>This is test content.</p>',
      author: 'Ashish Jaiswal',
      categories: ['Backend Development'],
      tags: ['test'],
      status: 'published'
    };

    const createResponse = await axios.post(`${API_BASE}/admin/blogs`, blogData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Blog creation successful');
    console.log(`   Blog ID: ${createResponse.data.blog.id}`);
    console.log(`   Title: ${createResponse.data.blog.title}`);
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('   Status:', error.response?.status);
    console.error('   Message:', error.response?.data?.message);
    console.error('   Error:', error.response?.data?.error);
    console.error('   Details:', error.response?.data?.details);
    console.error('   Full response:', JSON.stringify(error.response?.data, null, 2));
  }
}

testBlogCreate(); 