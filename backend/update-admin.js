const bcrypt = require('bcryptjs');
const { AppDataSource } = require('./src/config/ormconfig');
const { AdminUser } = require('./src/models/AdminUser');

async function updateAdmin() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const adminRepo = AppDataSource.getRepository(AdminUser);
    
    // New admin credentials
    const newEmail = 'your_new_email@example.com';
    const newPassword = 'your_new_secure_password';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Find existing admin
    const existingAdmin = await adminRepo.findOne({
      where: { email: 'ashishjaiswal0701@gmail.com' }
    });

    if (existingAdmin) {
      // Update existing admin
      existingAdmin.email = newEmail;
      existingAdmin.password = hashedPassword;
      existingAdmin.name = 'Your New Name';
      
      await adminRepo.save(existingAdmin);
      console.log('✅ Admin user updated successfully');
      console.log(`📧 New email: ${newEmail}`);
      console.log(`🔑 New password: ${newPassword}`);
    } else {
      // Create new admin if doesn't exist
      const admin = adminRepo.create({
        email: newEmail,
        name: 'Your New Name',
        password: hashedPassword,
        isActive: true
      });
      
      await adminRepo.save(admin);
      console.log('✅ New admin user created successfully');
      console.log(`📧 Email: ${newEmail}`);
      console.log(`🔑 Password: ${newPassword}`);
    }

    console.log('\n🎉 Admin credentials updated!');
    console.log('⚠️  Remember to update your .env file too!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    process.exit(1);
  }
}

updateAdmin(); 