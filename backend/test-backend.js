const axios = require('axios');

async function testBackend() {
  try {
    console.log('🧪 Testing backend endpoints...');
    
    // Test projects endpoint
    console.log('\n📋 Testing /api/projects...');
    const projectsResponse = await axios.get('http://localhost:3000/api/projects');
    console.log('✅ Projects endpoint working');
    console.log(`   Found ${projectsResponse.data.projects?.length || 0} projects`);
    
    // Test featured projects
    console.log('\n⭐ Testing /api/projects/featured...');
    const featuredResponse = await axios.get('http://localhost:3000/api/projects/featured');
    console.log('✅ Featured projects endpoint working');
    console.log(`   Found ${featuredResponse.data.projects?.length || 0} featured projects`);
    
    // Test analytics
    console.log('\n📊 Testing /api/projects/analytics...');
    const analyticsResponse = await axios.get('http://localhost:3000/api/projects/analytics');
    console.log('✅ Analytics endpoint working');
    console.log(`   Total projects: ${analyticsResponse.data.summary?.totalProjects || 0}`);
    
    // Test categories
    console.log('\n🏷️ Testing /api/projects/categories...');
    const categoriesResponse = await axios.get('http://localhost:3000/api/projects/categories');
    console.log('✅ Categories endpoint working');
    console.log(`   Categories: ${categoriesResponse.data.categories?.join(', ') || 'None'}`);
    
    console.log('\n🎉 All backend endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testBackend(); 