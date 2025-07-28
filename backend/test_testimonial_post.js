const axios = require('axios');

async function testCreateTestimonial() {
  try {
    const response = await axios.post('http://localhost:3000/testimonials', {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer',
      company: 'Tech Corp',
      content: 'Great work! Very professional.',
      rating: 5
    });
    
    console.log('✅ Testimonial created successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Error creating testimonial:', error.response?.data || error.message);
  }
}

testCreateTestimonial(); 