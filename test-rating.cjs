const axios = require('axios');

async function testRating() {
  try {
    console.log('🧪 Testing Project Rating Endpoint...');
    
    const ratingData = {
      rating: 5,
      userId: 'test_user',
      userName: 'Test User'
    };

    const response = await axios.post(
      'http://localhost:3000/api/projects/1e695c2b-1858-4a0f-8e0c-ae1f3144ace3/ratings',
      ratingData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Rating submitted successfully:', response.data);
  } catch (error) {
    console.error('❌ Rating test failed:', error.response?.data || error.message);
  }
}

testRating(); 