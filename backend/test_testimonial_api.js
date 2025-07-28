const axios = require('axios');

const BASE_URL = 'http://localhost:3000/testimonials';

async function runTests() {
  try {
    // 1. Create a valid testimonial
    const validTestimonial = {
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'Developer',
      company: 'TestCorp',
      content: 'This is a great portfolio! Highly recommended.',
      rating: 5,
    };
    const createRes = await axios.post(BASE_URL, validTestimonial);
    console.log('✅ Created testimonial:', createRes.data.testimonial.id);
    const testimonialId = createRes.data.testimonial.id;

    // 2. Try to create an invalid testimonial (missing fields)
    try {
      await axios.post(BASE_URL, { name: '', email: 'bad', content: '', rating: 10 });
      console.log('❌ Invalid testimonial creation should have failed');
    } catch (err) {
      console.log('✅ Invalid testimonial rejected:', err.response.data);
    }

    // 3. Get all testimonials (should include the new one)
    const allRes = await axios.get(BASE_URL);
    console.log('✅ All testimonials:', allRes.data.testimonials.length);

    // 4. Get only approved testimonials (should be 0 at first)
    const approvedRes = await axios.get(BASE_URL + '?status=approved');
    console.log('✅ Approved testimonials:', approvedRes.data.testimonials.length);

    // 5. Approve the testimonial
    const statusRes = await axios.put(`${BASE_URL}/${testimonialId}/status`, { status: 'approved' });
    console.log('✅ Testimonial approved:', statusRes.data.testimonial.status);

    // 6. Get approved testimonials again (should be 1)
    const approvedRes2 = await axios.get(BASE_URL + '?status=approved');
    console.log('✅ Approved testimonials after approval:', approvedRes2.data.testimonials.length);

    // 7. Delete the testimonial
    const delRes = await axios.delete(`${BASE_URL}/${testimonialId}`);
    console.log('✅ Testimonial deleted:', delRes.data.message);

    // 8. Try to delete again (should fail)
    try {
      await axios.delete(`${BASE_URL}/${testimonialId}`);
      console.log('❌ Deleting non-existent testimonial should have failed');
    } catch (err) {
      console.log('✅ Deleting non-existent testimonial rejected:', err.response.data.message);
    }
  } catch (err) {
    console.error('❌ Test failed:', err.response ? err.response.data : err.message);
  }
}

runTests(); 