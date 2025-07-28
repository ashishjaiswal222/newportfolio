import { AppDataSource } from '../config/ormconfig';
import { AdminUser } from '../models/AdminUser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function initializeAdmin() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected');

    const adminRepo = AppDataSource.getRepository(AdminUser);
    
    // Check if admin user exists
    const existingAdmin = await adminRepo.findOne({
      where: { email: process.env.ADMIN_LOGIN_USERNAME }
    });

    if (existingAdmin) {
      console.log('Admin user already exists, updating password...');
      
      // Update password with hashed version
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_LOGIN_PASSWORD!, 12);
      existingAdmin.password = hashedPassword;
      existingAdmin.name = 'Ashish Jaiswal';
      existingAdmin.isActive = true;
      
      await adminRepo.save(existingAdmin);
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      
      // Create new admin user
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_LOGIN_PASSWORD!, 12);
      const admin = adminRepo.create({
        email: process.env.ADMIN_LOGIN_USERNAME,
        name: 'Ashish Jaiswal',
        password: hashedPassword,
        isActive: true
      });
      
      await adminRepo.save(admin);
      console.log('Admin user created successfully');
    }

    console.log('Admin initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  }
}

initializeAdmin(); 