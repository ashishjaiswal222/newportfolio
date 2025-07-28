const bcrypt = require('bcryptjs');
const { AppDataSource } = require('../config/ormconfig');
const { AdminUser } = require('../models/AdminUser');

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...');
    
    await AppDataSource.initialize();
    console.log('✅ Database connected');
    
    const adminRepo = AppDataSource.getRepository(AdminUser);
    
    // Check if admin already exists
    const existingAdmin = await adminRepo.findOne({ 
      where: { email: 'ashishjaiswal0701@gmail.com' } 
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Active:', existingAdmin.isActive);
      return;
    }
    
    // Hash the password
    const password = '@fusu649Ib'; // From your .env file
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create admin user
    const admin = adminRepo.create({
      email: 'ashishjaiswal0701@gmail.com',
      name: 'Ashish Jaiswal',
      password: hashedPassword,
      isActive: true
    });
    
    await adminRepo.save(admin);
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Password: @fusu649Ib (hashed)');
    console.log('\n🔐 You can now login with these credentials');
    
    await AppDataSource.destroy();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  }
}

setupAdmin(); 