import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type TestimonialStatus = 'pending' | 'approved' | 'rejected';

@Entity()
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 100, nullable: true })
  role!: string;

  @Column({ length: 100, nullable: true })
  company!: string;

  @Column('text')
  content!: string;

  @Column('int')
  rating!: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: TestimonialStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 