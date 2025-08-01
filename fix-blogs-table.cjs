const { Client } = require('pg');

async function fixBlogsTable() {
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

    // Check current table structure
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

    // Add missing columns if they don't exist
    console.log('\n🔧 Adding missing columns...');
    
    const missingColumns = [
      { name: 'readTime', type: 'VARCHAR(50)', nullable: true },
      { name: 'publishedAt', type: 'TIMESTAMP', nullable: true }
    ];

    for (const column of missingColumns) {
      try {
        const checkColumn = await client.query(`
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'blogs' AND column_name = $1
        `, [column.name]);
        
        if (checkColumn.rows.length === 0) {
          await client.query(`
            ALTER TABLE blogs ADD COLUMN "${column.name}" ${column.type}
          `);
          console.log(`✅ Added column: ${column.name}`);
        } else {
          console.log(`ℹ️  Column already exists: ${column.name}`);
        }
      } catch (error) {
        console.log(`❌ Error adding column ${column.name}:`, error.message);
      }
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

fixBlogsTable(); 