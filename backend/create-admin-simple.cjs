const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function createAdmin() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Hash password
    const password = '@fusu649Ib';
    const hashedPassword = await bcrypt.hash(password, 12);

    // Check if admin exists
    const checkResult = await client.query(
      'SELECT * FROM admin_user WHERE email = $1',
      ['ashishjaiswal0701@gmail.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', checkResult.rows[0].email);
      console.log('Name:', checkResult.rows[0].name);
      return;
    }

    // Create admin user
    const result = await client.query(
      `INSERT INTO admin_user (id, email, name, password, "isActive", "createdAt", "updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) 
       RETURNING id, email, name, "isActive"`,
      ['ashishjaiswal0701@gmail.com', 'Ashish Jaiswal', hashedPassword, true]
    );

    console.log('✅ Admin user created successfully!');
    console.log('ID:', result.rows[0].id);
    console.log('Email:', result.rows[0].email);
    console.log('Name:', result.rows[0].name);
    console.log('Password: @fusu649Ib (hashed)');
    console.log('\n🔐 You can now login with these credentials');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin(); 