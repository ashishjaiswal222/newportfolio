const { Client } = require('pg');
require('dotenv').config();

console.log('🔍 Checking Database Tables...\n');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'ashish_portfolio',
});

async function checkAndFixDatabase() {
  try {
    console.log('📊 Database config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      user: process.env.DB_USER || 'postgres',
      database: process.env.DB_NAME || 'ashish_portfolio'
    });
    
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if tables exist
    const tablesToCheck = [
      'users',
      'admin_user', 
      'projects',
      'blogs',
      'contact',
      'testimonial'
    ];

    console.log('\n📋 Checking existing tables...');
    const existingTables = [];
    const missingTables = [];

    for (const table of tablesToCheck) {
      try {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);
        
        if (result.rows[0].exists) {
          console.log(`✅ Table '${table}' exists`);
          existingTables.push(table);
        } else {
          console.log(`❌ Table '${table}' missing`);
          missingTables.push(table);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${table}':`, error.message);
        missingTables.push(table);
      }
    }

    console.log(`\n📊 Summary: ${existingTables.length} tables exist, ${missingTables.length} tables missing`);

    if (missingTables.length > 0) {
      console.log('\n🔧 Creating missing tables...');
      
      // Create UUID extension
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      console.log('✅ UUID extension ready');
      
      // Create missing tables
      for (const table of missingTables) {
        console.log(`📝 Creating table '${table}'...`);
        
        switch (table) {
          case 'users':
            await client.query(`
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
            `);
            break;
            
          case 'admin_user':
            await client.query(`
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
            `);
            break;
            
          case 'projects':
            await client.query(`
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
                challenges TEXT DEFAULT '[]',
                learnings TEXT DEFAULT '[]',
                tags TEXT DEFAULT '[]',
                ratings TEXT DEFAULT '[]',
                "averageRating" DECIMAL(3,2) DEFAULT 0,
                "totalRatings" INTEGER DEFAULT 0,
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
              );
            `);
            break;
            
          case 'blogs':
            await client.query(`
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
                bookmarks INTEGER DEFAULT 0,
                "readTime" VARCHAR(50),
                "seoTitle" VARCHAR(255),
                "seoDescription" TEXT,
                "seoKeywords" TEXT,
                "publishedAt" TIMESTAMP,
                "createdAt" TIMESTAMP DEFAULT NOW(),
                "updatedAt" TIMESTAMP DEFAULT NOW()
              );
            `);
            break;
            
          case 'contact':
            await client.query(`
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
            `);
            break;
            
          case 'testimonial':
            await client.query(`
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
            `);
            break;
        }
        
        console.log(`✅ Table '${table}' created successfully`);
      }
      
      // Create admin user if not exists
      const adminEmail = process.env.ADMIN_LOGIN_USERNAME || 'ashishjaiswal0701@gmail.com';
      const adminPassword = process.env.ADMIN_LOGIN_PASSWORD || '@fusu649Ib';
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const checkAdmin = await client.query('SELECT id FROM admin_user WHERE email = $1', [adminEmail]);
      if (checkAdmin.rows.length === 0) {
        await client.query(`
          INSERT INTO admin_user (email, name, password) 
          VALUES ($1, $2, $3)
        `, [adminEmail, 'Ashish Jaiswal', hashedPassword]);
        console.log('✅ Admin user created');
      } else {
        console.log('✅ Admin user already exists');
      }
      
    } else {
      console.log('\n✅ All tables exist! No action needed.');
    }
    
    await client.end();
    console.log('\n🎉 Database check and fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking/fixing database:', error.message);
    console.log('💡 Make sure PostgreSQL is running and credentials are correct');
  }
}

checkAndFixDatabase(); 