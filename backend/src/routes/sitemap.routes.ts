import { Router } from 'express';
import * as sitemapController from '../controllers/sitemap.controller';

const router = Router();

// Generate sitemap
router.get('/', sitemapController.generateSitemap);

export default router; 