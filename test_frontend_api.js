const axios = require('axios');

async function testFrontendAPI() {
  try {
    console.log('Testing frontend API call...');
    
    // Simulate the exact same call the frontend makes
    const response = await axios.get('http://localhost:3000/testimonials', {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    });
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testFrontendAPI(); 