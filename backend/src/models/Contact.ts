import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ContactReply } from './ContactReply';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  subject!: string;

  @Column('text')
  message!: string;

  @Column({ default: 'unread' })
  status!: 'unread' | 'read' | 'replied';

  @Column({ default: 'portfolio' })
  source!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ContactReply, reply => reply.contact)
  replies!: ContactReply[];
} 