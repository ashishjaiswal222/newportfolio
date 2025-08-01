const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testBlogIds() {
  try {
    console.log('🧪 Testing Blog IDs and Endpoints...\n');
    
    // Get all blogs
    console.log('1. Getting all blogs...');
    const blogsResponse = await axios.get(`${API_BASE}/blogs`);
    const blogs = blogsResponse.data.blogs;
    
    console.log(`✅ Found ${blogs.length} blogs:`);
    blogs.forEach((blog, index) => {
      console.log(`   ${index + 1}. ID: ${blog.id} | Title: ${blog.title}`);
    });
    
    if (blogs.length > 0) {
      const firstBlog = blogs[0];
      console.log(`\n2. Testing single blog access with ID: ${firstBlog.id}`);
      
      try {
        const singleBlogResponse = await axios.get(`${API_BASE}/blogs/${firstBlog.id}`);
        console.log('✅ Single blog access successful');
        console.log(`   Title: ${singleBlogResponse.data.blog.title}`);
      } catch (error) {
        console.log('❌ Single blog access failed:', error.response?.data || error.message);
      }
      
      console.log(`\n3. Testing blog analytics with ID: ${firstBlog.id}`);
      try {
        const analyticsResponse = await axios.get(`${API_BASE}/blogs/${firstBlog.id}/analytics`);
        console.log('✅ Blog analytics successful');
        console.log(`   Views: ${analyticsResponse.data.analytics.views}`);
      } catch (error) {
        console.log('❌ Blog analytics failed:', error.response?.data || error.message);
      }
    }
    
    console.log('\n4. Testing featured blogs...');
    try {
      const featuredResponse = await axios.get(`${API_BASE}/blogs/featured`);
      console.log(`✅ Featured blogs: ${featuredResponse.data.blogs.length} found`);
    } catch (error) {
      console.log('❌ Featured blogs failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBlogIds(); 