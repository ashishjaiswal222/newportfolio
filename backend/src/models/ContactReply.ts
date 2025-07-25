import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Contact } from './Contact';

@Entity()
export class ContactReply {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  message!: string;

  @Column()
  adminEmail!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Contact, contact => contact.replies, { onDelete: 'CASCADE' })
  contact!: Contact;
} 