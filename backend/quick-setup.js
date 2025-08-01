const { Client } = require('pg');

// Try different common PostgreSQL passwords
const passwords = ['postgres', 'password', 'admin', 'root', ''];

async function testConnection() {
  for (const password of passwords) {
    try {
      console.log(`🔍 Trying password: ${password || '(empty)'}`);
      
      const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: password,
        database: 'postgres', // Connect to default database
      });

      await client.connect();
      console.log(`✅ Connected with password: ${password || '(empty)'}`);
      
      // Check if portfolio_db exists
      const dbCheck = await client.query(`
        SELECT 1 FROM pg_database WHERE datname = 'portfolio_db'
      `);

      if (dbCheck.rows.length === 0) {
        console.log('📝 Creating portfolio_db database...');
        await client.query(`
          CREATE DATABASE portfolio_db
        `);
        console.log('✅ Database created successfully');
      } else {
        console.log('✅ Database already exists');
      }

      await client.end();
      
      // Set the working password for future use
      process.env.DB_PASSWORD = password;
      console.log(`🎉 Database setup successful with password: ${password || '(empty)'}`);
      return password;
      
    } catch (error) {
      console.log(`❌ Failed with password: ${password || '(empty)'} - ${error.message}`);
    }
  }
  
  console.log('❌ Could not connect with any common password');
  console.log('Please check your PostgreSQL installation and credentials');
  return null;
}

testConnection(); 