import { DataSource } from 'typeorm';
import { Contact } from '../models/Contact';
import { ContactReply } from '../models/ContactReply';
import { AdminUser } from '../models/AdminUser';
import { Testimonial } from '../models/Testimonial';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // For dev only; use migrations in prod
  logging: false,
  entities: [Contact, ContactReply, AdminUser, Testimonial],
  migrations: [],
  subscribers: [],
}); 