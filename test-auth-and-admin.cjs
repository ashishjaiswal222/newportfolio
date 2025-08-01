const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuthAndAdmin() {
  console.log('🧪 Testing Authentication and Admin Functionality...\n');
  
  let userToken = null;
  let adminToken = null;
  let testUserId = null;
  let testBlogId = null;

  try {
    // 1. Test User Registration
    console.log('1. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`,
      password: 'password123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE}/user/register`, registerData);
      console.log('✅ User registration successful');
      console.log(`   User ID: ${registerResponse.data.user.id}`);
      testUserId = registerResponse.data.user.id;
    } catch (error) {
      console.log('❌ User registration failed:', error.response?.data?.message || error.message);
    }

    // 2. Test User Login
    console.log('\n2. Testing User Login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/user/login`, {
        email: registerData.email,
        password: registerData.password
      });
      console.log('✅ User login successful');
      userToken = loginResponse.data.token;
    } catch (error) {
      console.log('❌ User login failed:', error.response?.data?.message || error.message);
    }

    // 3. Test Admin Login
    console.log('\n3. Testing Admin Login...');
    try {
      const adminLoginResponse = await axios.post(`${API_BASE}/admin/login`, {
        email: 'ashishjaiswal0701@gmail.com',
        password: '@fusu649Ib'
      });
      console.log('✅ Admin login successful');
      adminToken = adminLoginResponse.data.token;
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
    }

    // 4. Test Admin Blog Creation
    if (adminToken) {
      console.log('\n4. Testing Admin Blog Creation...');
      const blogData = {
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post created by admin',
        content: '<h1>Test Content</h1><p>This is test content for the blog post.</p>',
        author: 'Ashish Jaiswal',
        categories: ['Backend Development'],
        tags: ['test', 'admin', 'blog'],
        status: 'published',
        featured: false,
        seoTitle: 'Test Blog Post - Admin Created',
        seoDescription: 'A test blog post created by admin for testing purposes',
        seoKeywords: 'test, admin, blog, development'
      };

      try {
        const createBlogResponse = await axios.post(`${API_BASE}/admin/blogs`, blogData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Admin blog creation successful');
        console.log(`   Blog ID: ${createBlogResponse.data.blog.id}`);
        testBlogId = createBlogResponse.data.blog.id;
      } catch (error) {
        console.log('❌ Admin blog creation failed:', error.response?.data?.message || error.message);
      }
    }

    // 5. Test Blog Update
    if (adminToken && testBlogId) {
      console.log('\n5. Testing Blog Update...');
      const updateData = {
        title: 'Updated Test Blog Post',
        excerpt: 'This is an updated test blog post',
        status: 'published'
      };

      try {
        const updateResponse = await axios.put(`${API_BASE}/admin/blogs/${testBlogId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Blog update successful');
        console.log(`   Updated title: ${updateResponse.data.blog.title}`);
      } catch (error) {
        console.log('❌ Blog update failed:', error.response?.data?.message || error.message);
      }
    }

    // 6. Test User Profile Access
    if (userToken) {
      console.log('\n6. Testing User Profile Access...');
      try {
        const profileResponse = await axios.get(`${API_BASE}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
        console.log('✅ User profile access successful');
        console.log(`   User name: ${profileResponse.data.user.name}`);
      } catch (error) {
        console.log('❌ User profile access failed:', error.response?.data?.message || error.message);
      }
    }

    // 7. Test Admin Analytics
    if (adminToken) {
      console.log('\n7. Testing Admin Analytics...');
      try {
        const analyticsResponse = await axios.get(`${API_BASE}/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        console.log('✅ Admin analytics access successful');
        console.log(`   Analytics data received: ${Object.keys(analyticsResponse.data).length} keys`);
      } catch (error) {
        console.log('❌ Admin analytics failed:', error.response?.data?.message || error.message);
      }
    }

    // 8. Test Blog Deletion (Cleanup)
    if (adminToken && testBlogId) {
      console.log('\n8. Testing Blog Deletion (Cleanup)...');
      try {
        await axios.delete(`${API_BASE}/admin/blogs/${testBlogId}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        console.log('✅ Blog deletion successful');
      } catch (error) {
        console.log('❌ Blog deletion failed:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }

  console.log('\n📊 Authentication and Admin Test Summary:');
  console.log(`✅ User Token: ${userToken ? 'Obtained' : 'Failed'}`);
  console.log(`✅ Admin Token: ${adminToken ? 'Obtained' : 'Failed'}`);
  console.log(`✅ Blog Creation: ${testBlogId ? 'Successful' : 'Failed'}`);
}

testAuthAndAdmin(); 