const axios = require('axios');

async function testBlogFetch() {
  try {
    console.log('Testing blog fetch with ID 1...');
    const response = await axios.get('http://localhost:3000/api/blogs/1');
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.response?.headers);
  }
}

testBlogFetch(); 