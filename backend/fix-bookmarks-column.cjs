const { Client } = require('pg');

async function fixBookmarksColumn() {
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

    // Check if bookmarks column exists
    const checkBookmarks = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'blogs' AND column_name = 'bookmarks'
    `);
    
    if (checkBookmarks.rows.length > 0) {
      console.log('🔧 Renaming bookmarks column to bookmarkedBy...');
      
      // Drop the old column and add the new one
      await client.query('ALTER TABLE blogs DROP COLUMN bookmarks');
      console.log('✅ Dropped bookmarks column');
      
      await client.query('ALTER TABLE blogs ADD COLUMN "bookmarkedBy" TEXT DEFAULT \'[]\'');
      console.log('✅ Added bookmarkedBy column');
    } else {
      console.log('ℹ️  bookmarks column not found, checking for bookmarkedBy...');
      
      const checkBookmarkedBy = await client.query(`
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'bookmarkedBy'
      `);
      
      if (checkBookmarkedBy.rows.length === 0) {
        await client.query('ALTER TABLE blogs ADD COLUMN "bookmarkedBy" TEXT DEFAULT \'[]\'');
        console.log('✅ Added bookmarkedBy column');
      } else {
        console.log('ℹ️  bookmarkedBy column already exists');
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

fixBookmarksColumn(); 