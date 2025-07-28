const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🚀 Testing Email Configuration...\n');

  console.log('Email Configuration:');
  console.log('Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
  console.log('Port:', process.env.EMAIL_PORT || '587');
  console.log('User:', process.env.COMPANY_EMAIL);
  console.log('Password:', process.env.COMPANY_EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:8084');

  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.COMPANY_EMAIL,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });

    console.log('\n✅ Email transporter created successfully');

    // Test the connection
    await transporter.verify();
    console.log('✅ Email connection verified successfully');

    console.log('\n🎉 Email configuration is working!');

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail(); 