import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  website?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  jobTitle?: string;

  @Column({ type: 'simple-array', default: [] })
  socialLinks: string[];

  @Column({ type: 'simple-array', default: [] })
  skills: string[];

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSeenAt?: Date;

  @Column({ type: 'int', default: 0 })
  loginCount: number;

  @Column({ type: 'simple-array', default: [] })
  likedBlogs: string[];

  @Column({ type: 'simple-array', default: [] })
  bookmarkedBlogs: string[];

  @Column({ type: 'simple-array', default: [] })
  likedProjects: string[];

  @Column({ type: 'simple-array', default: [] })
  bookmarkedProjects: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
} 