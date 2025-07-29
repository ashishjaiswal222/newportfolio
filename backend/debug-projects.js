const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function debugProjects() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Debugging projects endpoint...');
    
    // Test the exact query that TypeORM would run
    console.log('\n📋 Testing basic query...');
    const basicQuery = await client.query('SELECT * FROM projects LIMIT 5');
    console.log('✅ Basic query successful');
    console.log(`   Found ${basicQuery.rows.length} projects`);
    
    // Test with query builder style
    console.log('\n📋 Testing query builder style...');
    const queryBuilderQuery = await client.query(`
      SELECT 
        project.id,
        project.title,
        project.description,
        project.category,
        project.status,
        project.featured,
        project.views,
        project.stars,
        project.average_rating,
        project.total_ratings
      FROM projects project
      ORDER BY project.created_at DESC
      LIMIT 10
    `);
    console.log('✅ Query builder style successful');
    console.log(`   Found ${queryBuilderQuery.rows.length} projects`);
    
    // Check for any data issues
    console.log('\n📋 Checking for data issues...');
    const dataCheck = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(title) as with_title,
        COUNT(description) as with_description,
        COUNT(category) as with_category,
        COUNT(status) as with_status
      FROM projects
    `);
    console.log('📊 Data integrity check:', dataCheck.rows[0]);
    
    // Show sample data
    console.log('\n📋 Sample project data:');
    const sampleData = await client.query(`
      SELECT id, title, description, category, status, views, stars 
      FROM projects 
      LIMIT 3
    `);
    
    sampleData.rows.forEach((row, index) => {
      console.log(`   Project ${index + 1}:`);
      console.log(`     ID: ${row.id}`);
      console.log(`     Title: ${row.title}`);
      console.log(`     Category: ${row.category}`);
      console.log(`     Status: ${row.status}`);
      console.log(`     Views: ${row.views}, Stars: ${row.stars}`);
    });
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('   Stack:', error.stack);
  } finally {
    client.release();
    await pool.end();
  }
}

debugProjects(); 