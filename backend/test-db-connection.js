const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testDatabaseConnection() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log('   Current time:', result.rows[0].now);
    
    // Check if projects table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'projects'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Projects table exists');
      
      // Check table structure
      const structure = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'projects' 
        ORDER BY ordinal_position
      `);
      
      console.log('📋 Projects table structure:');
      structure.rows.forEach(row => {
        console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
      
      // Check if there's any data
      const countResult = await client.query('SELECT COUNT(*) as count FROM projects');
      console.log(`📊 Projects count: ${countResult.rows[0].count}`);
      
      if (countResult.rows[0].count > 0) {
        const sampleData = await client.query('SELECT id, title, description FROM projects LIMIT 3');
        console.log('📋 Sample projects:');
        sampleData.rows.forEach(row => {
          console.log(`   - ${row.title}: ${row.description?.substring(0, 50)}...`);
        });
      } else {
        console.log('⚠️ No projects found in database');
      }
      
    } else {
      console.log('❌ Projects table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testDatabaseConnection(); 