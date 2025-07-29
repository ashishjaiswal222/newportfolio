const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const projects = [
  {
    title: "IoT-Based Smart Plant Monitoring",
    description: "Created a Smart Plant IoT system utilizing full-stack web development and IoT integration to monitor and manage plant care in real-time via a web application and hardware components.",
    content: "A comprehensive IoT solution that combines hardware sensors with a web-based dashboard. The system monitors soil moisture, temperature, humidity, and light levels, providing real-time alerts and automated watering capabilities. Built with Node.js backend, React frontend, and Arduino hardware integration.",
    featuredImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["JavaScript", "Node.js", "Express.js", "PostgreSQL", "D3.js", "Tailwind CSS", "WebSocket", "Arduino"],
    demoUrl: "https://smart-plant-demo.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/smart-plant-monitoring",
    category: "IoT",
    status: "completed",
    featured: true,
    order: 1,
    period: "Jan 2023 - April 2023",
    startDate: "2023-01-15",
    completionDate: "2023-04-30",
    views: 1250,
    stars: 45,
    challenges: [
      "Integrating multiple sensor types with consistent data format",
      "Real-time data synchronization between hardware and web interface",
      "Optimizing battery life for wireless sensors"
    ],
    learnings: [
      "IoT architecture patterns and best practices",
      "Real-time data visualization with D3.js",
      "Hardware-software integration techniques"
    ],
    tags: ["iot", "monitoring", "automation", "sensors"]
  },
  {
    title: "Real-Time Environmental Monitoring - airVibe",
    description: "Developed a real-time environmental monitoring system that tracks air quality (CO2, NH3, CO, AQI) and weather data using Arduino sensors and OpenWeatherMap API.",
    content: "An advanced environmental monitoring platform that collects data from multiple air quality sensors and weather APIs. Features include real-time dashboards, historical data analysis, alert systems, and mobile notifications. The system helps users understand air quality patterns and make informed decisions about outdoor activities.",
    featuredImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["Node.js", "Express.js", "PostgreSQL", "Chart.js", "WebSocket", "Arduino", "JWT", "OpenWeatherMap API"],
    demoUrl: "https://airvibe-demo.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/airvibe",
    category: "IoT",
    status: "completed",
    featured: true,
    order: 2,
    period: "Feb 2024 - April 2024",
    startDate: "2024-02-01",
    completionDate: "2024-04-15",
    views: 980,
    stars: 32,
    challenges: [
      "Calibrating multiple air quality sensors for accuracy",
      "Handling high-frequency data streams efficiently",
      "Creating intuitive data visualization for complex metrics"
    ],
    learnings: [
      "Environmental sensor calibration and validation",
      "Time-series data processing and storage",
      "API integration and data aggregation techniques"
    ],
    tags: ["environmental", "air-quality", "monitoring", "weather"]
  },
  {
    title: "Cyberpunk Portfolio",
    description: "A futuristic portfolio website with cyberpunk design, 3D animations, particle effects, and comprehensive admin panel for content management.",
    content: "A cutting-edge portfolio website that showcases modern web development techniques with a cyberpunk aesthetic. Features include 3D animations, particle effects, interactive elements, and a full-featured admin panel for content management. Built with React, TypeScript, and modern CSS techniques.",
    featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["React", "TypeScript", "Framer Motion", "Three.js", "Tailwind CSS", "Chart.js", "Node.js", "PostgreSQL"],
    demoUrl: "https://cyberpunk-portfolio.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/cyberpunk-portfolio",
    category: "Web Development",
    status: "completed",
    featured: true,
    order: 3,
    period: "2024",
    startDate: "2024-01-01",
    completionDate: "2024-06-01",
    views: 2100,
    stars: 78,
    challenges: [
      "Creating smooth 3D animations without performance issues",
      "Implementing responsive design with complex animations",
      "Building a comprehensive admin system with real-time updates"
    ],
    learnings: [
      "Advanced React patterns and performance optimization",
      "3D web graphics and animation techniques",
      "Full-stack application architecture and deployment"
    ],
    tags: ["portfolio", "cyberpunk", "3d", "animations", "admin-panel"]
  },
  {
    title: "Full Stack E-Commerce Platform",
    description: "Complete e-commerce solution with user authentication, payment integration, real-time inventory management, and admin dashboard.",
    content: "A comprehensive e-commerce platform built with modern technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, inventory tracking, and a powerful admin dashboard. The platform is designed to handle high traffic and provide excellent user experience.",
    featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe API", "JWT", "Redux", "Socket.io"],
    demoUrl: "https://ecommerce-demo.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/ecommerce-platform",
    category: "Web Development",
    status: "in-progress",
    featured: false,
    order: 4,
    period: "2024",
    startDate: "2024-03-01",
    completionDate: null,
    views: 650,
    stars: 23,
    challenges: [
      "Implementing secure payment processing",
      "Managing real-time inventory updates",
      "Creating scalable database architecture"
    ],
    learnings: [
      "Payment gateway integration and security",
      "Real-time application development with WebSockets",
      "Database design for e-commerce applications"
    ],
    tags: ["ecommerce", "payment", "inventory", "real-time"]
  },
  {
    title: "AI-Powered Code Review Assistant",
    description: "An intelligent code review system that uses machine learning to analyze code quality, suggest improvements, and detect potential bugs.",
    content: "A sophisticated AI-powered tool that helps developers improve code quality through automated analysis. The system uses machine learning models to detect code smells, suggest refactoring opportunities, and identify potential security vulnerabilities. Integrates with popular Git platforms and provides detailed reports.",
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["Python", "TensorFlow", "FastAPI", "PostgreSQL", "Docker", "GitHub API", "React", "TypeScript"],
    demoUrl: "https://code-review-ai.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/code-review-ai",
    category: "AI/ML",
    status: "in-progress",
    featured: true,
    order: 5,
    period: "2024",
    startDate: "2024-05-01",
    completionDate: null,
    views: 420,
    stars: 15,
    challenges: [
      "Training accurate ML models for code analysis",
      "Integrating with multiple Git platforms",
      "Providing actionable feedback to developers"
    ],
    learnings: [
      "Machine learning for code analysis",
      "API integration and webhook handling",
      "Natural language processing for code comments"
    ],
    tags: ["ai", "ml", "code-review", "automation", "git"]
  },
  {
    title: "Blockchain-Based Supply Chain Tracker",
    description: "A decentralized supply chain tracking system using blockchain technology to ensure transparency and traceability of products.",
    content: "A blockchain-powered platform that enables end-to-end supply chain visibility. The system tracks products from manufacturing to delivery, ensuring authenticity and preventing counterfeiting. Uses smart contracts for automated compliance and provides real-time tracking for all stakeholders.",
    featuredImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    technologies: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js", "IPFS", "MetaMask", "Truffle"],
    demoUrl: "https://supply-chain-blockchain.vercel.app",
    githubUrl: "https://github.com/ashishjaiswal222/supply-chain-blockchain",
    category: "Blockchain",
    status: "active",
    featured: false,
    order: 6,
    period: "2024",
    startDate: "2024-04-01",
    completionDate: null,
    views: 320,
    stars: 12,
    challenges: [
      "Designing efficient smart contracts for supply chain",
      "Handling blockchain transaction costs and gas fees",
      "Ensuring data privacy while maintaining transparency"
    ],
    learnings: [
      "Blockchain development and smart contract design",
      "Decentralized application architecture",
      "Supply chain management and logistics"
    ],
    tags: ["blockchain", "supply-chain", "smart-contracts", "decentralized"]
  }
];

async function seedProjects() {
  try {
    console.log('Starting project seeding...');
    
    // Clear existing projects
    await pool.query('DELETE FROM projects');
    console.log('Cleared existing projects');
    
    // Insert new projects
    for (const project of projects) {
      const query = `
        INSERT INTO projects (
          title, description, content, featured_image, images, technologies,
          demo_url, github_url, category, status, featured, "order",
          period, start_date, completion_date, views, stars, challenges,
          learnings, tags, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())
      `;
      
      const values = [
        project.title,
        project.description,
        project.content,
        project.featuredImage,
        JSON.stringify(project.images),
        JSON.stringify(project.technologies),
        project.demoUrl,
        project.githubUrl,
        project.category,
        project.status,
        project.featured,
        project.order,
        project.period,
        project.startDate,
        project.completionDate,
        project.views,
        project.stars,
        JSON.stringify(project.challenges),
        JSON.stringify(project.learnings),
        JSON.stringify(project.tags)
      ];
      
      await pool.query(query, values);
      console.log(`✓ Seeded project: ${project.title}`);
    }
    
    console.log('✅ Project seeding completed successfully!');
    console.log(`📊 Seeded ${projects.length} projects`);
    
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
  } finally {
    await pool.end();
  }
}

seedProjects(); 