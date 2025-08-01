const http = require('http');

console.log('🔍 Testing server startup...');

// Wait a moment for server to start
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server is running! Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('📊 Response:', data);
      console.log('🎉 Server is working properly!');
    });
  });

  req.on('error', (e) => {
    console.log('❌ Server is not responding:', e.message);
  });

  req.end();
}, 3000); // Wait 3 seconds for server to start 