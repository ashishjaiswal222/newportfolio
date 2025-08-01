import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Blog } from '../models/Blog';
import { Project } from '../models/Project';

const blogRepository = AppDataSource.getRepository(Blog);
const projectRepository = AppDataSource.getRepository(Project);

export const generateSitemap = async (req: Request, res: Response) => {
  try {
    const baseUrl = 'https://ashishjaiswal.dev';
    const currentDate = new Date().toISOString();

    // Get all published blogs
    const blogs = await blogRepository.find({
      where: { status: 'published' },
      select: ['id', 'updatedAt', 'createdAt']
    });

    // Get all projects
    const projects = await projectRepository.find({
      select: ['id', 'updatedAt', 'createdAt']
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Blog Posts -->
  ${blogs.map(blog => `
  <url>
    <loc>${baseUrl}/blog/${blog.id}</loc>
    <lastmod>${blog.updatedAt || blog.createdAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Projects -->
  ${projects.map(project => `
  <url>
    <loc>${baseUrl}/project/${project.id}</loc>
    <lastmod>${project.updatedAt || project.createdAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}; 