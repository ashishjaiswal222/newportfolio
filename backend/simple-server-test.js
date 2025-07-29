const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Simple projects endpoint
app.get('/api/projects', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM projects LIMIT 10');
    client.release();
    
    res.json({ 
      projects: result.rows,
      message: 'Projects fetched successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Simple test server running on http://localhost:${port}`);
  console.log('📋 Available endpoints:');
  console.log('   GET /api/test');
  console.log('   GET /api/projects');
}); 