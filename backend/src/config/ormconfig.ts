import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Contact } from '../models/Contact';
import { ContactReply } from '../models/ContactReply';
import { AdminUser } from '../models/AdminUser';
import { User } from '../models/User';
import { Testimonial } from '../models/Testimonial';
import { Project } from '../models/Project';
import { Blog } from '../models/Blog';
import { Comment } from '../models/Comment';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'ashish_portfolio',
  synchronize: false, // Disabled to prevent schema conflicts
  logging: process.env.NODE_ENV === 'development',
  entities: [Contact, ContactReply, AdminUser, User, Testimonial, Project, Blog, Comment],
  migrations: [],
  subscribers: [],
}); 