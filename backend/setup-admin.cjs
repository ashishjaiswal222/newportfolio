const bcrypt = require('bcryptjs');
const { DataSource } = require('typeorm');
const { Contact } = require('./src/models/Contact');
const { ContactReply } = require('./src/models/ContactReply');
const { AdminUser } = require('./src/models/AdminUser');
const { Testimonial } = require('./src/models/Testimonial');
require('dotenv').config();

// Create a new DataSource for this script
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Contact, ContactReply, AdminUser, Testimonial],
  migrations: [],
  subscribers: [],
});

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