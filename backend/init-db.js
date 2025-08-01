const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'ashish_portfolio',
});

async function initDatabase() {
  try {
    console.log('🔧 Initializing database...');
    console.log('📊 Database config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      user: process.env.DB_USERNAME || 'postgres',
      database: process.env.DB_DATABASE || 'portfolio_db'
    });
    
    // Create UUID extension
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension ready');
    
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(255),
        bio TEXT,
        website VARCHAR(100),
        location VARCHAR(100),
        company VARCHAR(100),
        "jobTitle" VARCHAR(100),
        "socialLinks" TEXT DEFAULT '[]',
        skills TEXT DEFAULT '[]',
        "emailVerified" BOOLEAN DEFAULT false,
        "emailVerificationToken" VARCHAR(255),
        "emailVerificationExpires" TIMESTAMP,
        "resetPasswordToken" VARCHAR(255),
        "resetPasswordExpires" TIMESTAMP,
        "isActive" BOOLEAN DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "lastSeenAt" TIMESTAMP,
        "loginCount" INTEGER DEFAULT 0,
        "likedBlogs" TEXT DEFAULT '[]',
        "bookmarkedBlogs" TEXT DEFAULT '[]',
        "likedProjects" TEXT DEFAULT '[]',
        "bookmarkedProjects" TEXT DEFAULT '[]',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createUsersTable);
    console.log('✅ Users table created/verified');
    
    // Create admin_user table
    const createAdminTable = `
      CREATE TABLE IF NOT EXISTS admin_user (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "lastLoginAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createAdminTable);
    console.log('✅ Admin user table created/verified');
    
    // Create projects table
    const createProjectsTable = `
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL DEFAULT 'Untitled Project',
        description TEXT,
        content TEXT,
        "featuredImage" VARCHAR(255),
        images TEXT DEFAULT '[]',
        technologies TEXT DEFAULT '[]',
        "demoUrl" VARCHAR(255),
        "githubUrl" VARCHAR(255),
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        featured BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        period VARCHAR(100),
        "startDate" DATE,
        "completionDate" DATE,
        views INTEGER DEFAULT 0,
        stars INTEGER DEFAULT 0,
        challenges TEXT,
        learnings TEXT,
        tags TEXT DEFAULT '[]',
        ratings TEXT DEFAULT '[]',
        "averageRating" DECIMAL(3,2) DEFAULT 0,
        "totalRatings" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createProjectsTable);
    console.log('✅ Projects table created/verified');
    
    // Create blogs table
    const createBlogsTable = `
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        "featuredImage" VARCHAR(255),
        author VARCHAR(255) NOT NULL,
        categories TEXT DEFAULT '[]',
        tags TEXT DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'draft',
        "isPinned" BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        "bookmarkedBy" TEXT DEFAULT '[]',
        "seoTitle" VARCHAR(255),
        "seoDescription" TEXT,
        "seoKeywords" TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createBlogsTable);
    console.log('✅ Blogs table created/verified');
    
    // Create contact table
    const createContactTable = `
      CREATE TABLE IF NOT EXISTS contact (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR(255) NOT NULL,
        "lastName" VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        source VARCHAR(100) DEFAULT 'portfolio',
        status VARCHAR(50) DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createContactTable);
    console.log('✅ Contact table created/verified');
    
    // Create testimonial table
    const createTestimonialTable = `
      CREATE TABLE IF NOT EXISTS testimonial (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        "profileImage" VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `;
    await pool.query(createTestimonialTable);
    console.log('✅ Testimonial table created/verified');
    
    // Create admin user if not exists
    const adminEmail = process.env.ADMIN_LOGIN_USERNAME || 'admin@ashishjaiswal.dev';
    const adminPassword = process.env.ADMIN_LOGIN_PASSWORD || 'admin123';
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const checkAdmin = await pool.query('SELECT id FROM admin_user WHERE email = $1', [adminEmail]);
    if (checkAdmin.rows.length === 0) {
      await pool.query(`
        INSERT INTO admin_user (email, name, password) 
        VALUES ($1, $2, $3)
      `, [adminEmail, 'Ashish Jaiswal', hashedPassword]);
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  } finally {
    await pool.end();
  }
}

initDatabase(); 