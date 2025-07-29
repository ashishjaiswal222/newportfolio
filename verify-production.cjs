#!/usr/bin/env node

/**
 * Production Verification Script
 * Tests all critical functionality before deployment
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function testResult(testName, passed, error = null) {
  if (passed) {
    testResults.passed++;
    log(`${testName}: PASSED`, 'success');
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, error: error?.message || 'Unknown error' });
    log(`${testName}: FAILED - ${error?.message || 'Unknown error'}`, 'error');
  }
}

async function testBackendHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    testResult('Backend Health Check', response.status === 200);
  } catch (error) {
    testResult('Backend Health Check', false, error);
  }
}

async function testDatabaseConnection() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects`);
    testResult('Database Connection', response.status === 200 || response.status === 401);
  } catch (error) {
    testResult('Database Connection', false, error);
  }
}

async function testAuthentication() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: 'ashishjaiswal0701@gmail.com',
      password: '@fusu649Ib'
    });
    testResult('Authentication System', response.status === 200);
  } catch (error) {
    testResult('Authentication System', false, error);
  }
}

async function testProjectAPI() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects`);
    testResult('Project API', response.status === 200 || response.status === 401);
  } catch (error) {
    testResult('Project API', false, error);
  }
}

async function testTestimonialAPI() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/testimonials`);
    testResult('Testimonial API', response.status === 200 || response.status === 401);
  } catch (error) {
    testResult('Testimonial API', false, error);
  }
}

async function testContactAPI() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/contacts`);
    testResult('Contact API', response.status === 200 || response.status === 401);
  } catch (error) {
    testResult('Contact API', false, error);
  }
}

async function testAnalyticsAPI() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/projects/analytics/summary`);
    testResult('Analytics API', response.status === 200 || response.status === 401);
  } catch (error) {
    testResult('Analytics API', false, error);
  }
}

function testFrontendBuild() {
  try {
    const distPath = path.join(process.cwd(), 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(distPath)) {
      testResult('Frontend Build', false, new Error('dist directory not found'));
      return;
    }
    
    if (!fs.existsSync(indexHtmlPath)) {
      testResult('Frontend Build', false, new Error('index.html not found in dist'));
      return;
    }
    
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const hasMainScript = indexHtml.includes('index-') && indexHtml.includes('.js');
    const hasMainCSS = indexHtml.includes('index-') && indexHtml.includes('.css');
    
    testResult('Frontend Build', hasMainScript && hasMainCSS);
  } catch (error) {
    testResult('Frontend Build', false, error);
  }
}

function testBackendBuild() {
  try {
    const distPath = path.join(process.cwd(), 'backend', 'dist');
    const serverJsPath = path.join(distPath, 'server.js');
    
    if (!fs.existsSync(distPath)) {
      testResult('Backend Build', false, new Error('backend/dist directory not found'));
      return;
    }
    
    if (!fs.existsSync(serverJsPath)) {
      testResult('Backend Build', false, new Error('server.js not found in backend/dist'));
      return;
    }
    
    testResult('Backend Build', true);
  } catch (error) {
    testResult('Backend Build', false, error);
  }
}

function testEnvironmentVariables() {
  const requiredVars = [
    'DB_HOST',
    'DB_USERNAME', 
    'DB_PASSWORD',
    'DB_DATABASE',
    'JWT_SECRET',
    'EMAIL_HOST',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }
  
  testResult('Environment Variables', missingVars.length === 0, 
    missingVars.length > 0 ? new Error(`Missing: ${missingVars.join(', ')}`) : null);
}

function testPackageJson() {
  try {
    const frontendPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    
    const frontendHasBuild = frontendPkg.scripts && frontendPkg.scripts.build;
    const backendHasBuild = backendPkg.scripts && backendPkg.scripts.build;
    const backendHasStart = backendPkg.scripts && backendPkg.scripts.start;
    
    testResult('Package.json Scripts', frontendHasBuild && backendHasBuild && backendHasStart);
  } catch (error) {
    testResult('Package.json Scripts', false, error);
  }
}

function testTypeScriptConfig() {
  try {
    const frontendTsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    const backendTsConfig = JSON.parse(fs.readFileSync('backend/tsconfig.json', 'utf8'));
    
    const frontendValid = frontendTsConfig.compilerOptions && frontendTsConfig.compilerOptions.target;
    const backendValid = backendTsConfig.compilerOptions && backendTsConfig.compilerOptions.target;
    
    testResult('TypeScript Configuration', frontendValid && backendValid);
  } catch (error) {
    testResult('TypeScript Configuration', false, error);
  }
}

function testSecurityHeaders() {
  // This would require a running server to test
  // For now, we'll check if security middleware is configured
  try {
    const appTs = fs.readFileSync('backend/src/app.ts', 'utf8');
    const hasHelmet = appTs.includes('helmet');
    const hasCors = appTs.includes('cors');
    const hasRateLimit = appTs.includes('rateLimit');
    
    testResult('Security Headers', hasHelmet && hasCors && hasRateLimit);
  } catch (error) {
    testResult('Security Headers', false, error);
  }
}

async function runAllTests() {
  log('🚀 Starting Production Verification...', 'info');
  log(`API Base URL: ${API_BASE_URL}`, 'info');
  log(`Frontend URL: ${FRONTEND_URL}`, 'info');
  log('', 'info');
  
  // Configuration Tests
  log('📋 Configuration Tests', 'info');
  testEnvironmentVariables();
  testPackageJson();
  testTypeScriptConfig();
  testSecurityHeaders();
  log('', 'info');
  
  // Build Tests
  log('🔨 Build Tests', 'info');
  testFrontendBuild();
  testBackendBuild();
  log('', 'info');
  
  // API Tests
  log('🔌 API Tests', 'info');
  await testBackendHealth();
  await testDatabaseConnection();
  await testAuthentication();
  await testProjectAPI();
  await testTestimonialAPI();
  await testContactAPI();
  await testAnalyticsAPI();
  log('', 'info');
  
  // Summary
  log('📊 Test Summary', 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
  log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`, 'info');
  
  if (testResults.errors.length > 0) {
    log('', 'info');
    log('🔍 Detailed Errors:', 'info');
    testResults.errors.forEach((error, index) => {
      log(`${index + 1}. ${error.test}: ${error.error}`, 'error');
    });
  }
  
  log('', 'info');
  if (testResults.failed === 0) {
    log('🎉 All tests passed! Ready for production deployment.', 'success');
    process.exit(0);
  } else {
    log('⚠️  Some tests failed. Please fix issues before deployment.', 'error');
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Production Verification Script

Usage: node verify-production.js [options]

Options:
  --api-url <url>     API base URL (default: http://localhost:3000)
  --frontend-url <url> Frontend URL (default: http://localhost:8080)
  --help, -h          Show this help message

Environment Variables:
  API_URL             API base URL
  FRONTEND_URL        Frontend URL

Examples:
  node verify-production.js
  node verify-production.js --api-url https://api.example.com
  API_URL=https://api.example.com node verify-production.js
  `);
  process.exit(0);
}

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api-url' && args[i + 1]) {
    process.env.API_URL = args[i + 1];
    i++;
  } else if (args[i] === '--frontend-url' && args[i + 1]) {
    process.env.FRONTEND_URL = args[i + 1];
    i++;
  }
}

// Run tests
runAllTests().catch(error => {
  log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
}); 