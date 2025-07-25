import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = () => {
  const projects = [
    {
      title: "IoT-Based Smart Plant Monitoring",
      description: "Created a Smart Plant IoT system utilizing full-stack web development and IoT integration to monitor and manage plant care in real-time via a web application and hardware components.",
      technologies: ["JavaScript", "Node.js", "Express.js", "PostgreSQL", "D3.js", "Tailwind CSS", "WebSocket"],
      period: "Jan 2023 - April 2023",
      github: "https://github.com/ashishjaiswal222",
      demo: "#"
    },
    {
      title: "Real-Time Environmental Monitoring - airVibe",
      description: "Developed a real-time environmental monitoring system that tracks air quality (CO2, NH3, CO, AQI) and weather data using Arduino sensors and OpenWeatherMap API.",
      technologies: ["Node.js", "Express.js", "PostgreSQL", "Chart.js", "WebSocket", "Arduino", "JWT"],
      period: "Feb 2024 - April 2024", 
      github: "https://github.com/ashishjaiswal222",
      demo: "#"
    },
    {
      title: "Cyberpunk Portfolio",
      description: "A futuristic portfolio website with cyberpunk design, 3D animations, particle effects, and comprehensive admin panel for content management.",
      technologies: ["React", "TypeScript", "Framer Motion", "Three.js", "Tailwind CSS", "Chart.js"],
      period: "2024",
      github: "https://github.com/ashishjaiswal222",
      demo: "#"
    },
    {
      title: "Full Stack E-Commerce Platform",
      description: "Complete e-commerce solution with user authentication, payment integration, real-time inventory management, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Express.js", "Stripe API", "JWT"],
      period: "2024",
      github: "https://github.com/ashishjaiswal222",
      demo: "#"
    }
  ];

  return (
    <section className="py-20 cyber-grid">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-6xl font-bold text-gradient-cyber mb-4">
            PROJECTS
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="cyber-border p-6 h-full group hover:glow-cyan transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-orbitron text-xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span className="text-sm text-foreground/60">{project.period}</span>
                  </div>
                  
                  <p className="text-foreground/80 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cyber-button flex-1"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      className="cyber-button flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt className="mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;