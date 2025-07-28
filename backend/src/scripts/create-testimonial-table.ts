import { AppDataSource } from '../config/ormconfig';

async function createTestimonialTable() {
  try {
    console.log('Connecting to database...');
    await AppDataSource.initialize();
    console.log('Database connected successfully!');

    console.log('Creating testimonial table...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Create testimonial table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS testimonial (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        role VARCHAR(100),
        company VARCHAR(100),
        content TEXT NOT NULL,
        rating INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Testimonial table created successfully!');

    // Check if table exists
    const tables = await queryRunner.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'testimonial';
    `);

    console.log('Existing tables:', tables);

    await queryRunner.release();
    await AppDataSource.destroy();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestimonialTable(); 