import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaQuoteLeft, FaStar, FaLinkedin, FaBuilding } from 'react-icons/fa';
import { useState, useEffect } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import TestimonialForm from "@/components/TestimonialForm";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Senior Software Engineer",
      company: "Tech Innovations Ltd",
      image: "/api/placeholder/100/100",
      rating: 5,
      text: "Ashish demonstrated exceptional problem-solving skills during our IoT project. His ability to integrate frontend and backend technologies seamlessly is remarkable. A true full-stack developer with great attention to detail.",
      project: "Smart Plant Monitoring System",
      linkedin: "https://linkedin.com/in/placeholder"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Project Manager",
      company: "Digital Solutions Inc",
      image: "/api/placeholder/100/100",
      rating: 5,
      text: "Working with Ashish on the environmental monitoring project was amazing. He delivered high-quality code on time and was always ready to take on new challenges. His Node.js and React expertise really shined through.",
      project: "AirVibe Environmental Monitor",
      linkedin: "https://linkedin.com/in/placeholder"
    },
    {
      id: 3,
      name: "Dr. Amit Patel",
      role: "Technical Lead",
      company: "Innovation Hub",
      image: "/api/placeholder/100/100",
      rating: 5,
      text: "Ashish's understanding of modern web technologies and his ability to implement complex features is impressive. His portfolio website itself is a testament to his skills in creating engaging user experiences.",
      project: "Portfolio Development",
      linkedin: "https://linkedin.com/in/placeholder"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      role: "UI/UX Designer",
      company: "Creative Studios",
      image: "/api/placeholder/100/100",
      rating: 4,
      text: "Ashish perfectly translated our design concepts into beautiful, responsive interfaces. His knowledge of CSS frameworks and attention to pixel-perfect implementation made our collaboration smooth and efficient.",
      project: "E-Commerce Platform",
      linkedin: "https://linkedin.com/in/placeholder"
    }
  ];

  const achievements = [
    { metric: "98%", label: "Client Satisfaction", color: "text-green-400" },
    { metric: "15+", label: "Projects Completed", color: "text-blue-400" },
    { metric: "4.9★", label: "Average Rating", color: "text-yellow-400" },
    { metric: "100%", label: "On-Time Delivery", color: "text-purple-400" }
  ];

  return (
    <section id="testimonials" className="py-20 px-6 relative cyber-grid">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-gradient-cyber mb-4">
            CLIENT TESTIMONIALS
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6 animate-neon-pulse"></div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            What clients and collaborators say about working with me
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="cyber-border p-8 h-full bg-background/30 backdrop-blur-sm hover:shadow-glow-purple transition-all duration-300">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-6">
                  <FaQuoteLeft className="text-3xl text-primary/60 group-hover:text-primary transition-colors duration-300" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-foreground/80 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </blockquote>

                {/* Project Badge */}
                <div className="mb-6">
                  <Badge variant="outline" className="border-accent text-accent">
                    Project: {testimonial.project}
                  </Badge>
                </div>

                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 border-2 border-primary/30">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </Avatar>
                    <div>
                      <h4 className="font-orbitron font-bold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-foreground/60">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center text-xs text-foreground/50">
                        <FaBuilding className="mr-1" />
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <a 
                    href={testimonial.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="cyber-border p-8 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm">
            <h3 className="font-orbitron text-2xl font-bold text-center text-primary mb-8">
              REPUTATION & ACHIEVEMENTS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className={`text-4xl font-bold font-orbitron mb-2 ${achievement.color} group-hover:scale-110 transition-transform duration-300`}>
                    {achievement.metric}
                  </div>
                  <div className="text-foreground/60 text-sm">
                    {achievement.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Testimonial Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <TestimonialForm />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="cyber-border p-8 bg-background/20 backdrop-blur-sm">
            <h3 className="font-orbitron text-2xl font-bold text-primary mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              Join the list of satisfied clients and let's build something amazing together. 
              I'm committed to delivering exceptional results that exceed expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#contact"
                className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded transition-all duration-300 hover:shadow-glow-cyan"
              >
                Start Your Project
              </a>
              <a 
                href="mailto:ashishjaiswal0701@gmail.com"
                className="cyber-button border border-accent text-accent hover:bg-accent/10 px-8 py-3 rounded transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;