const { Client } = require('pg');

async function fixArrays() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '1234',
    database: 'ashish_portfolio',
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Check current column types
    console.log('\n📋 Current blogs table structure:');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' 
      ORDER BY ordinal_position
    `);
    
    columnsResult.rows.forEach(row => {
      console.log(`   ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Fix categories and tags columns
    console.log('\n🔧 Fixing categories and tags columns...');
    
    try {
      // Change categories from TEXT to TEXT[]
      await client.query('ALTER TABLE blogs ALTER COLUMN categories TYPE TEXT[] USING categories::TEXT[]');
      console.log('✅ Fixed categories column to TEXT[]');
    } catch (error) {
      console.log('ℹ️  Categories column already fixed or error:', error.message);
    }

    try {
      // Change tags from TEXT to TEXT[]
      await client.query('ALTER TABLE blogs ALTER COLUMN tags TYPE TEXT[] USING tags::TEXT[]');
      console.log('✅ Fixed tags column to TEXT[]');
    } catch (error) {
      console.log('ℹ️  Tags column already fixed or error:', error.message);
    }

    // Verify final structure
    console.log('\n📋 Final blogs table structure:');
    const finalColumnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'blogs' 
      ORDER BY ordinal_position
    `);
    
    finalColumnsResult.rows.forEach(row => {
      console.log(`   ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixArrays(); 