import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Comment, CommentStatus } from '../models/Comment';
import { Blog } from '../models/Blog';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

// Get comments for a blog
export const getComments = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const { status = 'approved' } = req.query;

    const commentRepo = AppDataSource.getRepository(Comment);
    const blogRepo = AppDataSource.getRepository(Blog);

    // Check if blog exists
    const blog = await blogRepo.findOne({ where: { id: blogId } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comments = await commentRepo.find({
      where: {
        blogId,
        status: status as CommentStatus,
        parentId: null // Only get top-level comments
      },
      relations: ['author', 'replies', 'replies.author'],
      order: {
        createdAt: 'DESC'
      }
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
};

// Create a new comment
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { blogId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const commentRepo = AppDataSource.getRepository(Comment);
    const blogRepo = AppDataSource.getRepository(Blog);
    const userRepo = AppDataSource.getRepository(User);

    // Check if blog exists
    const blog = await blogRepo.findOne({ where: { id: blogId } });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user exists
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await commentRepo.findOne({ 
        where: { id: parentId, blogId } 
      });
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = commentRepo.create({
      content: content.trim(),
      blogId,
      authorId: userId,
      parentId: parentId || null,
      status: CommentStatus.PENDING
    });

    await commentRepo.save(comment);

    // Fetch the comment with author details
    const savedComment = await commentRepo.findOne({
      where: { id: comment.id },
      relations: ['author']
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment: savedComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Update a comment
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const commentRepo = AppDataSource.getRepository(Comment);

    const comment = await commentRepo.findOne({
      where: { id },
      relations: ['author']
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user can edit this comment (author or admin)
    if (comment.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    await commentRepo.save(comment);

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete a comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const commentRepo = AppDataSource.getRepository(Comment);

    const comment = await commentRepo.findOne({
      where: { id },
      relations: ['author']
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user can delete this comment (author or admin)
    if (comment.authorId !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await commentRepo.remove(comment);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

// Moderate a comment (admin only)
export const moderateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    if (!Object.values(CommentStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const commentRepo = AppDataSource.getRepository(Comment);

    const comment = await commentRepo.findOne({
      where: { id },
      relations: ['author']
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = status;
    await commentRepo.save(comment);

    res.json({
      message: 'Comment moderated successfully',
      comment
    });
  } catch (error) {
    console.error('Moderate comment error:', error);
    res.status(500).json({ message: 'Failed to moderate comment' });
  }
}; 