interface SitemapItem {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (items: SitemapItem[]): string => {
  const baseUrl = 'https://ashishjaiswal.dev'; // Replace with your domain
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/portfolio</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Dynamic Content -->
  ${items.map(item => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${item.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${item.changefreq || 'weekly'}</changefreq>
    <priority>${item.priority || 0.6}</priority>
  </url>`).join('')}
</urlset>`;

  return sitemap;
};

export const saveSitemap = async (sitemap: string): Promise<void> => {
  try {
    const response = await fetch('/api/sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: sitemap,
    });
    
    if (!response.ok) {
      throw new Error('Failed to save sitemap');
    }
  } catch (error) {
    console.error('Error saving sitemap:', error);
  }
}; 