import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING
  })
  status: CommentStatus;

  @Column('uuid')
  blogId: string;

  @Column('uuid')
  authorId: string;

  @Column('uuid', { nullable: true })
  parentId?: string;

  // @ManyToOne(() => Blog, blog => blog.comments, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'blogId' })
  // blog: Blog;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Comment, comment => comment.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Comment;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 