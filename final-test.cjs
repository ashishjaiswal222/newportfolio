const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function finalTest() {
  console.log('🎯 Final Comprehensive Test - All Core Functionality\n');
  
  let passed = 0;
  let failed = 0;

  const tests = [
    {
      name: 'Health Check',
      test: async () => {
        const response = await axios.get(`${API_BASE}/health`);
        return response.data.status === 'OK';
      }
    },
    {
      name: 'User Registration',
      test: async () => {
        const response = await axios.post(`${API_BASE}/user/register`, {
          name: 'Final Test User',
          email: `finaltest${Date.now()}@example.com`,
          password: 'password123'
        });
        return response.data.user && response.data.user.id;
      }
    },
    {
      name: 'User Login',
      test: async () => {
        // Create a user first, then login
        const email = `finaltest${Date.now()}@example.com`;
        await axios.post(`${API_BASE}/user/register`, {
          name: 'Final Test User',
          email: email,
          password: 'password123'
        });
        
        const response = await axios.post(`${API_BASE}/user/login`, {
          email: email,
          password: 'password123'
        });
        return response.data.token;
      }
    },
    {
      name: 'Admin Login',
      test: async () => {
        const response = await axios.post(`${API_BASE}/admin/login`, {
          email: 'ashishjaiswal0701@gmail.com',
          password: '@fusu649Ib'
        });
        return response.data.token;
      }
    },
    {
      name: 'Projects List',
      test: async () => {
        const response = await axios.get(`${API_BASE}/projects`);
        return response.data.projects && response.data.projects.length > 0;
      }
    },
    {
      name: 'Project Rating',
      test: async () => {
        const response = await axios.post(`${API_BASE}/projects/1e695c2b-1858-4a0f-8e0c-ae1f3144ace3/ratings`, {
          rating: 5,
          userId: 'test_user_final',
          userName: 'Final Test User'
        });
        return response.data.message === 'Rating added successfully';
      }
    },
    {
      name: 'Blogs List',
      test: async () => {
        const response = await axios.get(`${API_BASE}/blogs`);
        return response.data.blogs && response.data.blogs.length > 0;
      }
    },
    {
      name: 'Admin Blog Creation',
      test: async () => {
        const adminLogin = await axios.post(`${API_BASE}/admin/login`, {
          email: 'ashishjaiswal0701@gmail.com',
          password: '@fusu649Ib'
        });
        
        const response = await axios.post(`${API_BASE}/admin/blogs`, {
          title: 'Final Test Blog',
          excerpt: 'Final test blog post',
          content: '<h1>Final Test</h1><p>This is a final test blog post.</p>',
          author: 'Ashish Jaiswal',
          categories: ['Backend Development'],
          tags: ['test', 'final'],
          status: 'published'
        }, {
          headers: {
            'Authorization': `Bearer ${adminLogin.data.token}`
          }
        });
        
        return response.data.blog && response.data.blog.id;
      }
    },
    {
      name: 'Testimonials List',
      test: async () => {
        const response = await axios.get(`${API_BASE}/testimonials`);
        return response.data.testimonials && response.data.testimonials.length >= 0;
      }
    },
    {
      name: 'Contact Creation',
      test: async () => {
        const response = await axios.post(`${API_BASE}/contacts`, {
          firstName: 'Final',
          lastName: 'Test',
          email: 'finaltest@example.com',
          subject: 'Final Test Contact',
          message: 'This is a final test contact message'
        });
        return response.data && (response.data.contact || response.data.message);
      }
    },
    {
      name: 'Admin Analytics',
      test: async () => {
        const adminLogin = await axios.post(`${API_BASE}/admin/login`, {
          email: 'ashishjaiswal0701@gmail.com',
          password: '@fusu649Ib'
        });
        
        const response = await axios.get(`${API_BASE}/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${adminLogin.data.token}`
          }
        });
        
        return response.data && Object.keys(response.data).length > 0;
      }
    }
  ];

  for (const test of tests) {
    try {
      console.log(`\n🧪 ${test.name}...`);
      const result = await test.test();
      
      if (result) {
        console.log(`✅ ${test.name}: Success`);
        passed++;
      } else {
        console.log(`❌ ${test.name}: Failed - No result`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Failed`);
      console.log(`   Error: ${error.response?.data?.message || error.message}`);
      failed++;
    }
  }

  console.log('\n📊 Final Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The system is fully functional.');
    console.log('\n✅ Core Features Working:');
    console.log('   • User Authentication (Register/Login)');
    console.log('   • Admin Authentication');
    console.log('   • Project Management & Ratings');
    console.log('   • Blog Management (Create/Read)');
    console.log('   • Testimonials');
    console.log('   • Contact Form');
    console.log('   • Admin Analytics');
    console.log('   • Database Operations');
    console.log('   • API Endpoints');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

finalTest().catch(console.error); 