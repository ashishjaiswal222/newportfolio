const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_DATABASE || 'portfolio_db',
});

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema issues...');
    console.log('📊 Database config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      user: process.env.DB_USERNAME || 'postgres',
      database: process.env.DB_DATABASE || 'portfolio_db'
    });
    
    await client.connect();
    console.log('✅ Connected to database');

    // Fix projects table - update null title values
    console.log('📝 Fixing projects table...');
    const projectsResult = await client.query(`
      UPDATE projects 
      SET title = COALESCE(title, 'Untitled Project') 
      WHERE title IS NULL
    `);
    console.log(`✅ Updated ${projectsResult.rowCount} projects with null titles`);

    // Check if title column exists and is nullable
    const columnCheck = await client.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'title'
    `);

    if (columnCheck.rows.length > 0) {
      const column = columnCheck.rows[0];
      console.log(`📊 Title column: ${column.column_name}, nullable: ${column.is_nullable}, type: ${column.data_type}`);
      
      // If title column is nullable, make it NOT NULL
      if (column.is_nullable === 'YES') {
        console.log('🔧 Making title column NOT NULL...');
        await client.query(`
          ALTER TABLE projects 
          ALTER COLUMN title SET NOT NULL
        `);
        console.log('✅ Title column is now NOT NULL');
      }
    }

    // Fix any other potential schema issues
    console.log('🔧 Checking for other schema issues...');
    
    // Ensure all required columns exist with proper defaults
    await client.query(`
      ALTER TABLE projects 
      ALTER COLUMN status SET DEFAULT 'active'
    `);
    
    await client.query(`
      ALTER TABLE projects 
      ALTER COLUMN featured SET DEFAULT false
    `);
    
    await client.query(`
      ALTER TABLE projects 
      ALTER COLUMN views SET DEFAULT 0
    `);
    
    await client.query(`
      ALTER TABLE projects 
      ALTER COLUMN stars SET DEFAULT 0
    `);

    console.log('✅ Database schema fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

fixDatabase(); 