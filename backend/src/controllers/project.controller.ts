import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Project, ProjectStatus, ProjectCategory } from '../models/Project';

const projectRepository = AppDataSource.getRepository(Project);

// Simple test endpoint
export const testProjects = async (req: Request, res: Response) => {
  try {
    console.log('🧪 Testing projects endpoint...');
    
    // Try simple find
    const projects = await projectRepository.find({
      take: 5,
      order: { createdAt: 'DESC' }
    });
    
    console.log(`✅ Found ${projects.length} projects`);
    
    res.json({ 
      message: 'Test successful',
      count: projects.length,
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        status: p.status
      }))
    });
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.status(500).json({ 
      message: 'Test failed', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all projects with filtering, pagination, and sorting
export const getProjects = async (req: Request, res: Response) => {
  try {
    console.log('📋 Fetching projects...');
    
    const {
      status,
      category,
      featured,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    // Use simple find with options instead of query builder
    const findOptions: {
      take: number;
      skip: number;
      order: Record<string, 'ASC' | 'DESC'>;
      where?: Record<string, unknown>;
    } = {
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      order: { [sortBy as string]: sortOrder as 'ASC' | 'DESC' }
    };

    // Add where conditions
    const whereConditions: Record<string, unknown> = {};
    if (status && status !== 'all') {
      whereConditions.status = status;
    }
    if (category && category !== 'all') {
      whereConditions.category = category;
    }
    if (featured !== undefined) {
      whereConditions.featured = featured === 'true';
    }

    if (Object.keys(whereConditions).length > 0) {
      findOptions.where = whereConditions;
    }

    console.log('🔍 Find options:', JSON.stringify(findOptions, null, 2));

    const [projects, total] = await projectRepository.findAndCount(findOptions);

    console.log(`✅ Found ${projects.length} projects out of ${total}`);

    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ 
      message: 'Error fetching projects',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get featured projects
export const getFeaturedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await projectRepository.find({
      where: { featured: true, status: ProjectStatus.ACTIVE },
      order: { order: 'ASC', createdAt: 'DESC' }
    });

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Error fetching featured projects' });
  }
};

// Get single project by ID and increment views
export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Get project and increment views atomically
    const project = await projectRepository.findOne({ where: { id } });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment views
    project.views += 1;
    await projectRepository.save(project);

    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    console.log('📝 Creating project with data:', JSON.stringify(projectData, null, 2));
    
    // Ensure array fields are properly formatted for PostgreSQL
    const sanitizedData = {
      ...projectData,
      technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
      images: Array.isArray(projectData.images) ? projectData.images : [],
      challenges: Array.isArray(projectData.challenges) ? projectData.challenges : [],
      learnings: Array.isArray(projectData.learnings) ? projectData.learnings : [],
      tags: Array.isArray(projectData.tags) ? projectData.tags : [],
      ratings: Array.isArray(projectData.ratings) ? projectData.ratings : [],
      averageRating: projectData.averageRating || 0,
      totalRatings: projectData.totalRatings || 0,
      views: projectData.views || 0,
      stars: projectData.stars || 0,
      featured: projectData.featured || false,
      order: projectData.order || 0
    };
    
    console.log('📝 Sanitized project data:', JSON.stringify(sanitizedData, null, 2));
    
    const project = projectRepository.create(sanitizedData);
    console.log('📝 Project entity created:', project);
    
    const savedProject = await projectRepository.save(project);
    console.log('✅ Project saved successfully');
    
    res.status(201).json({ 
      message: 'Project created successfully', 
      project: savedProject 
    });
  } catch (error) {
    console.error('❌ Error creating project - Full error:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    if (error.code) console.error('❌ Error code:', error.code);
    if (error.detail) console.error('❌ Error detail:', error.detail);
    if (error.table) console.error('❌ Error table:', error.table);
    if (error.column) console.error('❌ Error column:', error.column);
    if (error.constraint) console.error('❌ Error constraint:', error.constraint);
    
    res.status(500).json({ 
      message: 'Error creating project',
      error: error.message,
      details: error.detail || error.code || 'Unknown error'
    });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    Object.assign(project, updateData);
    const updatedProject = await projectRepository.save(project);
    
    res.json({ 
      message: 'Project updated successfully', 
      project: updatedProject 
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectRepository.remove(project);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

// Toggle featured status
export const toggleFeatured = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.featured = !project.featured;
    const updatedProject = await projectRepository.save(project);
    
    res.json({ 
      message: 'Featured status updated successfully', 
      project: updatedProject 
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: 'Error updating featured status' });
  }
};

// User rating system - add rating
export const addRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, userId, userName, userIP } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Initialize ratings array if it doesn't exist
    if (!project.ratings) {
      project.ratings = [];
    }

    // Check if user has already rated (by userId or IP)
    const existingRatingIndex = project.ratings.findIndex(r => {
      // For logged-in users, check by userId
      if (userId && !userId.startsWith('ip_')) {
        return r.userId === userId;
      }
      // For anonymous users, check by IP
      if (userIP && userId && userId.startsWith('ip_')) {
        return r.userId === userId || r.userIP === userIP;
      }
      return false;
    });
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      project.ratings[existingRatingIndex] = {
        userId,
        userName,
        rating,
        ratedAt: new Date().toISOString(),
        userIP: userIP || null
      };
    } else {
      // Add new rating
      project.ratings.push({
        userId,
        userName,
        rating,
        ratedAt: new Date().toISOString(),
        userIP: userIP || null
      });
    }

    // Calculate new average rating
    const totalRating = project.ratings.reduce((sum, r) => sum + r.rating, 0);
    project.averageRating = totalRating / project.ratings.length;
    project.totalRatings = project.ratings.length;

    const updatedProject = await projectRepository.save(project);
    
    res.json({ 
      message: 'Rating added successfully', 
      project: updatedProject,
      userRating: rating
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Error adding rating' });
  }
};

// Get project ratings
export const getProjectRatings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ 
      ratings: project.ratings || [],
      averageRating: project.averageRating || 0,
      totalRatings: project.totalRatings || 0
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings' });
  }
};

// Increment stars (legacy function for compatibility)
export const incrementStars = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await projectRepository.findOne({ where: { id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.stars += 1;
    const updatedProject = await projectRepository.save(project);
    
    res.json({ 
      message: 'Star added successfully', 
      project: updatedProject 
    });
  } catch (error) {
    console.error('Error incrementing stars:', error);
    res.status(500).json({ message: 'Error adding star' });
  }
};

// Get project analytics
export const getProjectAnalytics = async (req: Request, res: Response) => {
  try {
    console.log('📊 Fetching project analytics...');
    
    // Get all projects for analytics
    const projects = await projectRepository.find();
    
    // Calculate analytics manually
    const statusStats = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryStats = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topViewedProjects = projects
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        views: p.views,
        stars: p.stars
      }));

    const topRatedProjects = projects
      .filter(p => p.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        views: p.views,
        averageRating: p.averageRating,
        totalRatings: p.totalRatings
      }));

    const summary = {
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      totalViews: projects.reduce((sum, p) => sum + p.views, 0),
      totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
      averageRating: projects.filter(p => p.averageRating > 0).length > 0 
        ? projects.filter(p => p.averageRating > 0).reduce((sum, p) => sum + p.averageRating, 0) / projects.filter(p => p.averageRating > 0).length
        : 0
    };

    console.log('✅ Analytics calculated successfully');

    res.json({
      statusStats: Object.entries(statusStats).map(([status, count]) => ({ status, count })),
      categoryStats: Object.entries(categoryStats).map(([category, count]) => ({ category, count })),
      topViewedProjects,
      topRatedProjects,
      summary
    });
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// Get project categories
export const getProjectCategories = async (req: Request, res: Response) => {
  try {
    const categories = Object.values(ProjectCategory);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Get project statuses
export const getProjectStatuses = async (req: Request, res: Response) => {
  try {
    const statuses = Object.values(ProjectStatus);
    res.json({ statuses });
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ message: 'Error fetching statuses' });
  }
}; 