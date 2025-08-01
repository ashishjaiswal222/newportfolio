const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'ashish_portfolio',
  user: 'postgres',
  password: '1234'
});

async function checkBlogIds() {
  try {
    console.log('Checking blog IDs in database...');
    const result = await pool.query('SELECT id, title, status FROM blogs ORDER BY "createdAt" DESC LIMIT 10');
    
    if (result.rows.length === 0) {
      console.log('No blogs found in database');
    } else {
      console.log('Found blogs:');
      result.rows.forEach((blog, index) => {
        console.log(`${index + 1}. ID: ${blog.id} | Title: ${blog.title} | Status: ${blog.status}`);
      });
    }
  } catch (error) {
    console.error('Error checking blog IDs:', error);
  } finally {
    await pool.end();
  }
}

checkBlogIds(); 