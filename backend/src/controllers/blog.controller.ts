import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Blog } from '../models/Blog';
import { Comment, CommentStatus } from '../models/Comment';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

const blogRepository = AppDataSource.getRepository(Blog);

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, category, tag, sort = 'latest' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = blogRepository.createQueryBuilder('blog')
      .where('blog.status = :status', { status: 'published' });

    // Search filter
    if (search) {
      query = query.andWhere(
        '(blog.title ILIKE :search OR blog.excerpt ILIKE :search OR blog.tags::text ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Category filter
    if (category) {
      query = query.andWhere('blog.categories::text ILIKE :category', { category: `%${category}%` });
    }

    // Tag filter
    if (tag) {
      query = query.andWhere('blog.tags::text ILIKE :tag', { tag: `%${tag}%` });
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        query = query.orderBy('blog.createdAt', 'ASC');
        break;
      case 'popular':
        query = query.orderBy('blog.views', 'DESC');
        break;
      case 'liked':
        query = query.orderBy('blog.likes', 'DESC');
        break;
      case 'title':
        query = query.orderBy('blog.title', 'ASC');
        break;
      default: // latest
        query = query.orderBy('blog.createdAt', 'DESC');
    }

    const [blogs, total] = await query
      .skip(skip)
      .take(Number(limit))
      .getManyAndCount();

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      blogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

export const getFeaturedBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await blogRepository.find({
      where: { 
        status: 'published',
        featured: true 
      },
      order: { createdAt: 'DESC' },
      take: 6
    });

    res.json({ blogs });
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    res.status(500).json({ message: 'Error fetching featured blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const blog = await blogRepository.findOne({
      where: { id, status: 'published' }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blogRepository.save(blog);

    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

export const getRelatedBlogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const currentBlog = await blogRepository.findOne({
      where: { id }
    });

    if (!currentBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const relatedBlogs = await blogRepository
      .createQueryBuilder('blog')
      .where('blog.id != :id', { id })
      .andWhere('blog.status = :status', { status: 'published' })
      .andWhere(
        '(blog.categories::text ILIKE :category OR blog.tags::text ILIKE :tags)',
        { 
          category: `%${currentBlog.categories[0]}%`,
          tags: `%${currentBlog.tags.slice(0, 2).join('%')}%`
        }
      )
      .orderBy('blog.views', 'DESC')
      .take(3)
      .getMany();

    res.json({ blogs: relatedBlogs });
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    res.status(500).json({ message: 'Error fetching related blogs' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const blogData = req.body;
    console.log('📝 Creating blog with data:', JSON.stringify(blogData, null, 2));
    
    // Ensure array fields are properly formatted for PostgreSQL
    const sanitizedData = {
      ...blogData,
      categories: Array.isArray(blogData.categories) ? blogData.categories : [],
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      views: blogData.views || 0,
      likes: blogData.likes || 0,
      bookmarkedBy: blogData.bookmarkedBy || [],
      featured: blogData.featured || false,
      isPinned: blogData.isPinned || false,
      status: blogData.status || 'draft',
      publishedAt: blogData.status === 'published' ? new Date() : null,
      readTime: blogData.readTime || null,
      seoTitle: blogData.seoTitle || null,
      seoDescription: blogData.seoDescription || null,
      seoKeywords: blogData.seoKeywords || null
    };
    
    console.log('📝 Sanitized blog data:', JSON.stringify(sanitizedData, null, 2));
    
    const blog = blogRepository.create(sanitizedData);
    console.log('📝 Blog entity created:', blog);

    const savedBlog = await blogRepository.save(blog);
    console.log('✅ Blog saved successfully');
    
    res.status(201).json({ blog: savedBlog });
  } catch (error) {
    console.error('❌ Error creating blog - Full error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    if (error.code) console.error('❌ Error code:', error.code);
    if (error.detail) console.error('❌ Error detail:', error.detail);
    if (error.table) console.error('❌ Error table:', error.table);
    if (error.column) console.error('❌ Error column:', error.column);
    if (error.constraint) console.error('❌ Error constraint:', error.constraint);
    
    res.status(500).json({ 
      message: 'Error creating blog',
      error: error.message,
      details: error.detail || error.code || 'Unknown error'
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update publishedAt if status changes to published
    if (updateData.status === 'published' && blog.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    Object.assign(blog, updateData);
    const savedBlog = await blogRepository.save(blog);

    res.json({ blog: savedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Error updating blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await blogRepository.remove(blog);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Error deleting blog' });
  }
};

export const likeBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.likes += 1;
    const savedBlog = await blogRepository.save(blog);

    res.json({ blog: savedBlog });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ message: 'Error liking blog' });
  }
};

export const bookmarkBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get user ID from auth middleware
    
    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.bookmarkedBy = blog.bookmarkedBy || [];
    if (userId && !blog.bookmarkedBy.includes(userId)) {
      blog.bookmarkedBy.push(userId);
    }
    const savedBlog = await blogRepository.save(blog);

    res.json({ blog: savedBlog });
  } catch (error) {
    console.error('Error bookmarking blog:', error);
    res.status(500).json({ message: 'Error bookmarking blog' });
  }
};

export const togglePin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.isPinned = !blog.isPinned;
    const savedBlog = await blogRepository.save(blog);

    res.json({ blog: savedBlog });
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({ message: 'Error toggling pin' });
  }
};

// Update blog status
export const updateBlogStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.status = status;
    
    // Set publishedAt if status changes to published
    if (status === 'published' && blog.status !== 'published') {
      blog.publishedAt = new Date();
    }

    const savedBlog = await blogRepository.save(blog);

    res.json({ 
      message: 'Blog status updated successfully',
      blog: savedBlog 
    });
  } catch (error) {
    console.error('Error updating blog status:', error);
    res.status(500).json({ message: 'Error updating blog status' });
  }
};

// Update blog SEO
export const updateBlogSEO = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seoTitle, seoDescription, seoKeywords } = req.body;

    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.seoTitle = seoTitle;
    blog.seoDescription = seoDescription;
    blog.seoKeywords = seoKeywords;

    const savedBlog = await blogRepository.save(blog);

    res.json({ 
      message: 'Blog SEO updated successfully',
      blog: savedBlog 
    });
  } catch (error) {
    console.error('Error updating blog SEO:', error);
    res.status(500).json({ message: 'Error updating blog SEO' });
  }
};

// Get blog analytics
export const getBlogAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await blogRepository.findOne({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Get comment count
    const commentRepo = AppDataSource.getRepository(Comment);
    const commentCount = await commentRepo.count({
      where: { blogId: id, status: CommentStatus.APPROVED }
    });

    const analytics = {
      blogId: blog.id,
      title: blog.title,
      views: blog.views,
      likes: blog.likes,
      bookmarks: blog.bookmarkedBy?.length || 0,
      comments: commentCount,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Error fetching blog analytics:', error);
    res.status(500).json({ message: 'Error fetching blog analytics' });
  }
}; 