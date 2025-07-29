const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function updateProjectsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Updating projects table with rating fields...');
    
    // Add rating fields to projects table
    await client.query(`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0
    `);
    
    console.log('✅ Projects table updated successfully with rating fields!');
    
    // Show current table structure
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current projects table structure:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
    });
    
  } catch (error) {
    console.error('❌ Error updating projects table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateProjectsTable(); 