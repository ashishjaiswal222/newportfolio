import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'varchar', length: 50 })
  type: 'personal' | 'about' | 'portfolio' | 'skills' | 'experience';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 