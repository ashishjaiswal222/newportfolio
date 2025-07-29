import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Contact } from '../models/Contact';
import { ContactReply } from '../models/ContactReply';
import { AdminUser } from '../models/AdminUser';
import { Testimonial } from '../models/Testimonial';
import { Project } from '../models/Project';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'portfolio_db',
  synchronize: false, // Disable auto-sync to prevent conflicts
  logging: process.env.NODE_ENV === 'development',
  entities: [Contact, ContactReply, AdminUser, Testimonial, Project],
  migrations: [],
  subscribers: [],
}); 