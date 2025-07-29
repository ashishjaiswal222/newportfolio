const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fixProjectsTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing projects table schema issues...');
    
    // First, let's see what's in the table
    const checkResult = await client.query('SELECT COUNT(*) as total, COUNT(title) as with_title FROM projects');
    console.log('📊 Current table state:', checkResult.rows[0]);
    
    // Check for null titles
    const nullTitlesResult = await client.query('SELECT COUNT(*) as null_titles FROM projects WHERE title IS NULL');
    console.log('❌ Null titles found:', nullTitlesResult.rows[0].null_titles);
    
    if (nullTitlesResult.rows[0].null_titles > 0) {
      console.log('🔄 Updating null titles with default values...');
      
      // Update null titles with default values
      await client.query(`
        UPDATE projects 
        SET title = 'Untitled Project ' || id::text 
        WHERE title IS NULL
      `);
      
      console.log('✅ Null titles updated');
    }
    
    // Now let's fix the column constraints
    console.log('🔧 Fixing column constraints...');
    
    // Make title NOT NULL if it's not already
    try {
      await client.query('ALTER TABLE projects ALTER COLUMN title SET NOT NULL');
      console.log('✅ Title column set to NOT NULL');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Title column already NOT NULL');
      } else {
        throw error;
      }
    }
    
    // Make description NOT NULL if it's not already
    try {
      await client.query('ALTER TABLE projects ALTER COLUMN description SET NOT NULL');
      console.log('✅ Description column set to NOT NULL');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Description column already NOT NULL');
      } else {
        throw error;
      }
    }
    
    // Ensure rating fields exist
    console.log('🔧 Ensuring rating fields exist...');
    
    try {
      await client.query(`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '[]',
        ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_ratings INTEGER DEFAULT 0
      `);
      console.log('✅ Rating fields added/verified');
    } catch (error) {
      console.log('ℹ️ Rating fields already exist');
    }
    
    // Show final table structure
    const structureResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Final projects table structure:');
    structureResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default || 'none'})`);
    });
    
    // Show sample data
    const sampleResult = await client.query('SELECT id, title, description, views, stars FROM projects LIMIT 3');
    console.log('\n📊 Sample project data:');
    sampleResult.rows.forEach(row => {
      console.log(`  - ${row.title}: ${row.views} views, ${row.stars} stars`);
    });
    
    console.log('\n✅ Projects table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing projects table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixProjectsTable(); 