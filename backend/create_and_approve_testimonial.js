const axios = require('axios');

async function createAndApproveTestimonial() {
  try {
    console.log('🚀 Creating a new testimonial...');
    
    // Step 1: Create a testimonial
    const createResponse = await axios.post('http://localhost:3000/testimonials', {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      role: 'Senior Developer',
      company: 'TechCorp Solutions',
      content: 'Ashish is an exceptional developer with deep expertise in modern web technologies. His attention to detail and problem-solving skills are outstanding. He delivered our project on time and exceeded our expectations. Highly recommended!',
      rating: 5
    });
    
    console.log('✅ Testimonial created successfully!');
    console.log('ID:', createResponse.data.testimonial.id);
    console.log('Status:', createResponse.data.testimonial.status);
    
    const testimonialId = createResponse.data.testimonial.id;
    
    // Step 2: Approve the testimonial
    console.log('\n🔄 Approving the testimonial...');
    const approveResponse = await axios.put(`http://localhost:3000/testimonials/${testimonialId}/status`, {
      status: 'approved'
    });
    
    console.log('✅ Testimonial approved successfully!');
    console.log('New Status:', approveResponse.data.testimonial.status);
    
    // Step 3: Verify it appears in approved testimonials
    console.log('\n🔍 Verifying approved testimonials...');
    const approvedResponse = await axios.get('http://localhost:3000/testimonials?status=approved');
    
    console.log('✅ Approved testimonials retrieved!');
    console.log('Total approved testimonials:', approvedResponse.data.testimonials.length);
    
    const approvedTestimonial = approvedResponse.data.testimonials.find(t => t.id === testimonialId);
    if (approvedTestimonial) {
      console.log('✅ Our testimonial is in the approved list!');
      console.log('Name:', approvedTestimonial.name);
      console.log('Company:', approvedTestimonial.company);
      console.log('Rating:', approvedTestimonial.rating);
      console.log('Content:', approvedTestimonial.content.substring(0, 100) + '...');
    } else {
      console.log('❌ Testimonial not found in approved list');
    }
    
    console.log('\n🎉 Test completed successfully!');
    console.log('Now check your portfolio at http://localhost:8080 to see the testimonial!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createAndApproveTestimonial(); 