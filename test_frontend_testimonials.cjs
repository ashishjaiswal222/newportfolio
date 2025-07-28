const axios = require('axios');

async function testFrontendTestimonials() {
  try {
    console.log('🧪 Testing frontend testimonials API call...');
    
    // Simulate the exact same call the frontend makes for approved testimonials
    const response = await axios.get('http://localhost:3000/testimonials?status=approved', {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    });
    
    console.log('✅ Success!');
    console.log('Status:', response.status);
    console.log('Total approved testimonials:', response.data.testimonials.length);
    
    if (response.data.testimonials.length > 0) {
      const testimonial = response.data.testimonials[0];
      console.log('\n📝 Sample testimonial:');
      console.log('Name:', testimonial.name);
      console.log('Company:', testimonial.company);
      console.log('Role:', testimonial.role);
      console.log('Rating:', testimonial.rating);
      console.log('Content:', testimonial.content.substring(0, 100) + '...');
      console.log('Status:', testimonial.status);
    }
    
    console.log('\n🎉 Frontend should now display this testimonial!');
    console.log('Visit: http://localhost:8080/#testimonials');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFrontendTestimonials(); 