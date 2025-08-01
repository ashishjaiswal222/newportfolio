import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  featuredImage?: string;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Column({ type: 'text', array: true })
  categories: string[];

  @Column({ type: 'text', array: true })
  tags: string[];

  @Column({ 
    type: 'enum', 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  })
  status: 'draft' | 'published' | 'archived';

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'simple-json', default: [] })
  bookmarkedBy: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  readTime?: string;

  // SEO fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle?: string;

  @Column({ type: 'text', nullable: true })
  seoDescription?: string;

  @Column({ type: 'text', nullable: true })
  seoKeywords?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 