const { Client } = require('pg');

async function checkAdmin() {
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

    // Check admin_user table
    const adminResult = await client.query('SELECT email, name FROM admin_user');
    console.log('\n📋 Admin users in database:');
    adminResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. Email: ${row.email} | Name: ${row.name}`);
    });

    // Check users table
    const userResult = await client.query('SELECT email, name FROM users LIMIT 5');
    console.log('\n📋 Recent users in database:');
    userResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. Email: ${row.email} | Name: ${row.name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAdmin(); 