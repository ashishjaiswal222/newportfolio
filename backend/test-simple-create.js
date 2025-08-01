const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

console.log('🔍 Testing Simple Create Operations (Fixed)...\n');

// Helper function to log test results
function logTest(testName, success, data = null, error = null) {
  const status = success ? '✅' : '❌';
  console.log(`${status} ${testName}`);
  if (data) {
    console.log(`   Status: ${data.status || 'N/A'}`);
    console.log(`   Data:`, JSON.stringify(data.data || data, null, 2));
  }
  if (error) {
    console.log(`   Error Status: ${error.response?.status || 'N/A'}`);
    console.log(`   Error Message:`, error.response?.data || error.message);
  }
  console.log('');
}

// Test 1: Simple Project Create (Fixed)
async function testSimpleProjectCreate() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token for project test');
    
    const projectData = {
      title: 'Simple Test Project (Fixed)',
      description: 'A simple test project with all required fields',
      content: 'Simple content for the project',
      category: 'Web Development',
      technologies: ['React', 'Node.js'],
      status: 'active',
      featured: false,
      order: 0,
      views: 0,
      stars: 0,
      challenges: [],
      learnings: [],
      tags: [],
      ratings: [],
      averageRating: 0,
      totalRatings: 0
    };
    
    console.log('📝 Sending fixed project data:', JSON.stringify(projectData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/projects`, projectData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Simple Project Create (Fixed)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Simple Project Create (Fixed)', false, null, error);
    return null;
  }
}

// Test 2: Simple Blog Create (Fixed)
async function testSimpleBlogCreate() {
  try {
    // First admin login to get token
    const loginResponse = await axios.post(`${BASE_URL}/admin/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('🔑 Got admin token for blog test');
    
    const blogData = {
      title: 'Simple Test Blog (Fixed)',
      content: 'Simple blog content with all required fields',
      excerpt: 'A simple excerpt for the blog post',
      author: 'Test Author',
      categories: ['Technology'],
      tags: ['test', 'blog'],
      status: 'published',
      isPinned: false,
      featured: false,
      views: 0,
      likes: 0,
      bookmarks: 0
    };
    
    console.log('📝 Sending fixed blog data:', JSON.stringify(blogData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/blogs`, blogData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    logTest('Simple Blog Create (Fixed)', true, response);
    return response.data.id;
  } catch (error) {
    logTest('Simple Blog Create (Fixed)', false, null, error);
    return null;
  }
}

// Test 3: Check if projects endpoint exists
async function testProjectsEndpoint() {
  try {
    const response = await axios.get(`${BASE_URL}/projects`);
    logTest('Projects Endpoint Check', true, response);
    return true;
  } catch (error) {
    logTest('Projects Endpoint Check', false, null, error);
    return false;
  }
}

// Test 4: Check if blogs endpoint exists
async function testBlogsEndpoint() {
  try {
    const response = await axios.get(`${BASE_URL}/blogs`);
    logTest('Blogs Endpoint Check', true, response);
    return true;
  } catch (error) {
    logTest('Blogs Endpoint Check', false, null, error);
    return false;
  }
}

// Main test runner
async function runSimpleTests() {
  console.log('🚀 Starting fixed simple create tests...\n');
  
  // Test 1: Check endpoints exist
  await testProjectsEndpoint();
  await testBlogsEndpoint();
  
  // Test 2: Simple Project Create (Fixed)
  await testSimpleProjectCreate();
  
  // Test 3: Simple Blog Create (Fixed)
  await testSimpleBlogCreate();
  
  console.log('🎉 Fixed simple create tests completed!');
}

// Run the tests
runSimpleTests().catch(console.error); 