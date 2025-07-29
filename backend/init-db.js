const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Create projects table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        featured_image VARCHAR(500),
        images JSON DEFAULT '[]',
        technologies JSON DEFAULT '[]',
        demo_url VARCHAR(500),
        github_url VARCHAR(500),
        category VARCHAR(100) DEFAULT 'Web Development',
        status VARCHAR(50) DEFAULT 'active',
        featured BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        period VARCHAR(100),
        start_date DATE,
        completion_date DATE,
        views INTEGER DEFAULT 0,
        stars INTEGER DEFAULT 0,
        challenges JSON DEFAULT '[]',
        learnings JSON DEFAULT '[]',
        tags JSON DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Projects table created/verified successfully!');
    
    // Check if table has data
    const countResult = await pool.query('SELECT COUNT(*) FROM projects');
    const count = parseInt(countResult.rows[0].count);
    console.log(`📊 Projects table has ${count} records`);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await pool.end();
  }
}

initDatabase(); 