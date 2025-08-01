import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import app from './app';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('🔄 Initializing database connection...');
    console.log('📊 Database config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_NAME || 'ashish_portfolio',
      user: process.env.DB_USER || 'postgres'
    });
    
    // Try to initialize database connection with proper error handling
    let dbConnected = false;
    try {
      await AppDataSource.initialize();
      console.log('✅ Database connection established');
      console.log('📋 Registered entities:', AppDataSource.entityMetadatas.map(e => e.name));
      dbConnected = true;
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      console.error('🔍 Error details:', {
        name: dbError.name,
        code: dbError.code,
        detail: dbError.detail
      });
      console.log('🚀 Starting server without database connection...');
      console.log('📝 Database-dependent features will be disabled');
      dbConnected = false;
    }
    
    // Start the server regardless of database status
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('📋 Available endpoints:');
      console.log('   GET  /api/health');
      console.log('   GET  /api/projects');
      console.log('   GET  /api/testimonials');
      console.log('   POST /api/contacts');
      console.log('   POST /api/user/login');
      console.log('   POST /api/admin/login');
      console.log('   GET  /api/admin/analytics');
      console.log('   GET  /sitemap.xml');
      
      if (!dbConnected) {
        console.log('⚠️  Database-dependent features will not work');
        console.log('💡 To enable full functionality:');
        console.log('   1. Install PostgreSQL');
        console.log('   2. Create database: portfolio_db');
        console.log('   3. Set environment variables in .env file');
      }
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.log('⚠️ Error closing database connection:', error.message);
    }
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  if (AppDataSource.isInitialized) {
    try {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed');
    } catch (error) {
      console.log('⚠️ Error closing database connection:', error.message);
    }
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
