const axios = require('axios');

async function testSimpleComments() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Simple Comment System\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check successful:', healthResponse.data.status);

    // Test 2: Get blogs
    console.log('\n2. Getting blogs...');
    const blogsResponse = await axios.get(`${baseURL}/api/blogs`);
    console.log('✅ Blogs fetched successfully');
    console.log('Blogs count:', blogsResponse.data.blogs?.length || 0);
    
    if (blogsResponse.data.blogs && blogsResponse.data.blogs.length > 0) {
      const blogId = blogsResponse.data.blogs[0].id;
      console.log('Using blog ID:', blogId);
      console.log('Blog title:', blogsResponse.data.blogs[0].title);

      // Test 3: Get comments for this blog
      console.log('\n3. Getting comments for blog...');
      try {
        const commentsResponse = await axios.get(`${baseURL}/api/blogs/${blogId}/comments`);
        console.log('✅ Comments fetched successfully');
        console.log('Comments count:', commentsResponse.data.comments?.length || 0);
        
        if (commentsResponse.data.comments && commentsResponse.data.comments.length > 0) {
          const firstComment = commentsResponse.data.comments[0];
          console.log('First comment:', {
            id: firstComment.id,
            content: firstComment.content.substring(0, 50) + '...',
            author: firstComment.author?.name,
            replies: firstComment.replies?.length || 0
          });
        }
      } catch (error) {
        console.log('❌ Failed to get comments:', error.response?.data?.message || error.message);
      }

      // Test 4: Try to register a user
      console.log('\n4. Testing user registration...');
      try {
        const registerResponse = await axios.post(`${baseURL}/api/user/register`, {
          email: 'testcomment@example.com',
          password: 'test123',
          name: 'Test Comment User'
        });
        console.log('✅ User registration successful');
      } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
          console.log('ℹ️ User already exists, proceeding with login');
        } else {
          console.log('❌ Registration failed:', error.response?.data?.message || error.message);
          console.log('Status:', error.response?.status);
          return;
        }
      }

      // Test 5: Try to login
      console.log('\n5. Testing user login...');
      try {
        const loginResponse = await axios.post(`${baseURL}/api/user/login`, {
          email: 'testcomment@example.com',
          password: 'test123'
        }, {
          withCredentials: true
        });
        console.log('✅ User login successful');
        console.log('Token received:', !!loginResponse.data.token);
        
        const userToken = loginResponse.data.token;

        // Test 6: Try to post a comment
        console.log('\n6. Testing comment creation...');
        try {
          const commentResponse = await axios.post(`${baseURL}/api/blogs/${blogId}/comments`, {
            content: 'This is a test comment from the test script!'
          }, {
            headers: {
              'Authorization': `Bearer ${userToken}`
            },
            withCredentials: true
          });
          console.log('✅ Comment created successfully');
          console.log('Comment ID:', commentResponse.data.comment.id);
          console.log('Comment content:', commentResponse.data.comment.content);
        } catch (error) {
          console.log('❌ Comment creation failed:', error.response?.data?.message || error.message);
          console.log('Status:', error.response?.status);
        }

      } catch (error) {
        console.log('❌ Login failed:', error.response?.data?.message || error.message);
        console.log('Status:', error.response?.status);
      }

    } else {
      console.log('❌ No blogs found to test comments on');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
  }
}

testSimpleComments(); 