const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Comprehensive Test Suite...\n');

// Test scripts to run
const testScripts = [
  { name: 'User Authentication', file: 'test-user-auth.js' },
  { name: 'Admin Authentication', file: 'test-admin-auth.js' },
  { name: 'Blog Functionality', file: 'test-blog-functionality.js' }
];

// Function to run a test script
function runTestScript(scriptName, scriptFile) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 Running ${scriptName} Tests...`);
    console.log('=' .repeat(50));
    
    const child = spawn('node', [scriptFile], {
      cwd: __dirname,
      stdio: 'pipe'
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });
    
    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${scriptName} Tests Completed Successfully\n`);
        resolve({ success: true, output, errorOutput });
      } else {
        console.log(`\n❌ ${scriptName} Tests Failed (Exit Code: ${code})\n`);
        resolve({ success: false, output, errorOutput, code });
      }
    });
    
    child.on('error', (error) => {
      console.log(`\n💥 ${scriptName} Tests Crashed: ${error.message}\n`);
      reject(error);
    });
  });
}

// Function to check if server is running
async function checkServerHealth() {
  const axios = require('axios');
  
  try {
    console.log('🏥 Checking server health...');
    const response = await axios.get('http://localhost:3000/api/health');
    if (response.data.status === 'OK') {
      console.log('✅ Server is running and healthy\n');
      return true;
    } else {
      console.log('⚠️ Server responded but status is not OK\n');
      return false;
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('Please start the server with: npm start\n');
    return false;
  }
}

// Function to create test user if needed
async function createTestUser() {
  const axios = require('axios');
  
  try {
    console.log('👤 Creating test user if needed...');
    
    // Try to login first
    const loginResponse = await axios.post('http://localhost:3000/api/user/login', {
      email: 'testuser@example.com',
      password: 'testpassword123'
    });
    
    if (loginResponse.data) {
      console.log('✅ Test user already exists and can login\n');
      return true;
    }
  } catch (error) {
    // User doesn't exist, create one
    try {
      const registerResponse = await axios.post('http://localhost:3000/api/user/register', {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpassword123'
      });
      
      if (registerResponse.data) {
        console.log('✅ Test user created successfully\n');
        return true;
      }
    } catch (registerError) {
      console.log('⚠️ Could not create test user, some tests may fail\n');
      return false;
    }
  }
  
  return false;
}

// Main test runner
async function runAllTests() {
  const results = [];
  
  try {
    // Check server health first
    const serverHealthy = await checkServerHealth();
    if (!serverHealthy) {
      console.log('❌ Cannot run tests - server is not available');
      process.exit(1);
    }
    
    // Create test user if needed
    await createTestUser();
    
    // Run each test script
    for (const script of testScripts) {
      try {
        const result = await runTestScript(script.name, script.file);
        results.push({
          name: script.name,
          ...result
        });
        
        // Add a small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({
          name: script.name,
          success: false,
          error: error.message
        });
      }
    }
    
    // Print summary
    console.log('\n📊 Test Results Summary');
    console.log('=' .repeat(50));
    
    let passedTests = 0;
    let failedTests = 0;
    
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.name}: PASSED`);
        passedTests++;
      } else {
        console.log(`❌ ${result.name}: FAILED`);
        if (result.error) {
          console.log(`   Error: ${result.error}`);
        }
        failedTests++;
      }
    });
    
    console.log('\n📈 Overall Results:');
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / results.length) * 100).toFixed(1)}%`);
    
    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! The system is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the output above for details.');
    }
    
  } catch (error) {
    console.error('💥 Test runner failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runAllTests(); 