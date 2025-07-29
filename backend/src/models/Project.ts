import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  IN_PROGRESS = 'in-progress'
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'Web Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  IOT = 'IoT',
  AI_ML = 'AI/ML',
  BLOCKCHAIN = 'Blockchain',
  GAME_DEVELOPMENT = 'Game Development',
  DATA_SCIENCE = 'Data Science',
  DEVOPS = 'DevOps',
  UI_UX = 'UI/UX',
  OTHER = 'Other'
}

interface ProjectRating {
  userId: string;
  userName: string;
  rating: number;
  ratedAt: string;
  userIP?: string;
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column('simple-array', { nullable: true })
  images: string[] = [];

  @Column('simple-array', { nullable: true })
  technologies: string[] = [];

  @Column({ nullable: true })
  demoUrl?: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
    default: ProjectCategory.WEB_DEVELOPMENT
  })
  category!: ProjectCategory;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE
  })
  status!: ProjectStatus;

  @Column({ default: false })
  featured!: boolean;

  @Column({ default: 0 })
  order!: number;

  @Column({ nullable: true })
  period?: string;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  completionDate?: Date;

  @Column({ default: 0 })
  views!: number;

  @Column({ default: 0 })
  stars!: number;

  @Column('simple-array', { nullable: true })
  challenges: string[] = [];

  @Column('simple-array', { nullable: true })
  learnings: string[] = [];

  @Column('simple-array', { nullable: true })
  tags: string[] = [];

  // Rating system fields
  @Column('simple-json', { nullable: true })
  ratings: ProjectRating[] = [];

  @Column({ 
    name: 'average_rating', 
    type: 'decimal', 
    precision: 3, 
    scale: 2, 
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value) || 0
    }
  })
  averageRating!: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 