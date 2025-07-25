import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const AboutSection = () => {
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
            ABOUT ME
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
        </motion.div>

        <Card className="cyber-border p-8 max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              I am a passionate <span className="text-primary font-bold">Full Stack Developer</span> currently pursuing 
              BCA from Tilak Maharashtra Vidyapeeth, Pune with a CGPA of 8.2. 
              Specialized in Java, React, Node.js, and modern web technologies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <h3 className="font-orbitron text-xl font-bold text-secondary">EDUCATION</h3>
                <div className="text-left space-y-2">
                  <p className="text-primary">BCA - Tilak Maharashtra Vidyapeeth</p>
                  <p className="text-foreground/60">2023 - Present | CGPA: 8.2</p>
                  <p className="text-foreground/60">Institute of Business and Research, CBD Belapur</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-orbitron text-xl font-bold text-secondary">LOCATION</h3>
                <div className="text-left space-y-2">
                  <p className="text-foreground/80">Mankhurd, Mumbai 400043</p>
                  <p className="text-foreground/80">Maharashtra, India</p>
                  <p className="text-primary">📧 ashishjaiswal0701@gmail.com</p>
                  <p className="text-primary">📞 +91 6394860044</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg">
              <h3 className="font-orbitron text-xl font-bold text-accent mb-4">ACHIEVEMENTS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <ul className="space-y-2">
                  <li className="text-foreground/80">🏆 Contingent Leader - Mood Indigo & TechFest 2023-24 (IIT Bombay)</li>
                  <li className="text-foreground/80">🎯 Campus Ambassador - E-Summit 2024 & 2025 (IIT Bombay)</li>
                  <li className="text-foreground/80">🥈 2nd Prize - Best Project in IT Forum</li>
                </ul>
                <ul className="space-y-2">
                  <li className="text-foreground/80">⭐ Best Volunteer of the Year (2024)</li>
                  <li className="text-foreground/80">👥 Class Representative (2nd & 3rd Semester)</li>
                  <li className="text-foreground/80">♟️ Chess Semi-Finalist (2x)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;