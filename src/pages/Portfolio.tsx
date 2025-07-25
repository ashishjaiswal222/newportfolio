import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import BlogSection from '@/components/portfolio/BlogSection';
import TestimonialsSection from '@/components/portfolio/TestimonialsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import ParticleBackground from '@/components/effects/ParticleBackground';
import MatrixRain from '@/components/effects/MatrixRain';

const Portfolio = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1 });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.1 });
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1 });
  const [experienceRef, experienceInView] = useInView({ threshold: 0.1 });
  const [contactRef, contactInView] = useInView({ threshold: 0.1 });

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      <MatrixRain />
      
      {/* Main Content */}
      <main className="relative z-10">
        <motion.section
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <HeroSection />
        </motion.section>

        <motion.section
          ref={aboutRef}
          initial={{ opacity: 0, y: 100 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8 }}
        >
          <AboutSection />
        </motion.section>

        <motion.section
          ref={skillsRef}
          initial={{ opacity: 0, y: 100 }}
          animate={skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8 }}
        >
          <SkillsSection />
        </motion.section>

        <motion.section
          ref={projectsRef}
          initial={{ opacity: 0, y: 100 }}
          animate={projectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8 }}
        >
          <ProjectsSection />
        </motion.section>

        <motion.section
          ref={experienceRef}
          initial={{ opacity: 0, y: 100 }}
          animate={experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8 }}
        >
          <ExperienceSection />
        </motion.section>

        <BlogSection />
        
        <TestimonialsSection />

        <motion.section
          ref={contactRef}
          initial={{ opacity: 0, y: 100 }}
          animate={contactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 0.8 }}
        >
          <ContactSection />
        </motion.section>
      </main>
    </div>
  );
};

export default Portfolio;