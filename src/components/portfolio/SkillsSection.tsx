import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  SiReact, 
  SiNodedotjs, 
  SiPostgresql, 
  SiJavascript, 
  SiExpress, 
  SiHtml5, 
  SiCss3, 
  SiC, 
  SiCplusplus,
  SiPython,
  SiDjango,
  SiFlask,
  SiAmazonwebservices,
  SiVercel,
  SiNetlify,
  SiDocker,
  SiMongodb,
  SiTailwindcss
} from 'react-icons/si';
import { FaJava, FaCode } from 'react-icons/fa';

const SkillsSection = () => {
  const skills = [
    { name: 'Java', level: 90, category: 'Programming', icon: FaJava, color: 'text-[#ED8B00]' },
    { name: 'Python', level: 85, category: 'Programming', icon: SiPython, color: 'text-[#3776AB]' },
    { name: 'JavaScript', level: 88, category: 'Programming', icon: SiJavascript, color: 'text-[#F7DF1E]' },
    { name: 'C++', level: 80, category: 'Programming', icon: SiCplusplus, color: 'text-[#00599C]' },
    { name: 'C', level: 75, category: 'Programming', icon: SiC, color: 'text-[#A8B9CC]' },
    { name: 'React', level: 88, category: 'Frontend', icon: SiReact, color: 'text-[#61DAFB]' },
    { name: 'HTML', level: 92, category: 'Frontend', icon: SiHtml5, color: 'text-[#E34F26]' },
    { name: 'CSS', level: 90, category: 'Frontend', icon: SiCss3, color: 'text-[#1572B6]' },
    { name: 'Tailwind', level: 85, category: 'Frontend', icon: SiTailwindcss, color: 'text-[#06B6D4]' },
    { name: 'Node.js', level: 85, category: 'Backend', icon: SiNodedotjs, color: 'text-[#339933]' },
    { name: 'Express.js', level: 80, category: 'Backend', icon: SiExpress, color: 'text-foreground' },
    { name: 'Flask', level: 78, category: 'Backend', icon: SiFlask, color: 'text-foreground' },
    { name: 'Django', level: 75, category: 'Backend', icon: SiDjango, color: 'text-[#092E20]' },
    { name: 'PostgreSQL', level: 80, category: 'Database', icon: SiPostgresql, color: 'text-[#4169E1]' },
    { name: 'MongoDB', level: 75, category: 'Database', icon: SiMongodb, color: 'text-[#47A248]' },
    { name: 'AWS', level: 70, category: 'Cloud', icon: SiAmazonwebservices, color: 'text-[#FF9900]' },
    { name: 'Vercel', level: 85, category: 'Deployment', icon: SiVercel, color: 'text-foreground' },
    { name: 'Netlify', level: 83, category: 'Deployment', icon: SiNetlify, color: 'text-[#00C7B7]' },
    { name: 'Docker', level: 68, category: 'DevOps', icon: SiDocker, color: 'text-[#2496ED]' },
  ];

  const categories = ['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'Deployment', 'DevOps'];

  const certifications = [
    "Agile with Atlassian (Coursera) 2024",
    "Generative AI (Google) 2024", 
    "Complete Full Stack Web Development (Udemy) 2024",
    "Robotics and IoT (Kaizen Technologies) 2023"
  ];

  return (
    <section id="skills" className="py-20 px-6 relative cyber-grid">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-gradient-cyber mb-4">
            TECHNICAL ARSENAL
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-6 animate-neon-pulse"></div>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            Mastering the art of code with cutting-edge technologies and frameworks
          </p>
        </motion.div>

        {/* Featured Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
          {skills.slice(0, 12).map((skill, index) => {
            const IconComponent = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group"
              >
                <Card className="cyber-border p-6 h-full bg-background/30 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-300 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <IconComponent className={`text-4xl ${skill.color} group-hover:scale-110 transition-transform duration-300`} />
                      <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-20 rounded-full blur-xl transition-opacity duration-300" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-sm text-foreground group-hover:text-primary transition-colors duration-300">
                      {skill.name}
                    </h3>
                    <div className="w-full h-1 bg-background/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-cyber"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: index * 0.05 }}
                      />
                    </div>
                    <span className="text-xs text-primary font-bold">{skill.level}%</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Skills by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.slice(0, 6).map((category, index) => {
            const categorySkills = skills.filter(skill => skill.category === category);
            if (categorySkills.length === 0) return null;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="cyber-border p-6 h-full bg-background/20 backdrop-blur-sm hover:shadow-glow-purple transition-all duration-300 group">
                  <h3 className="font-orbitron text-xl font-bold text-primary mb-6 text-center group-hover:text-accent transition-colors duration-300">
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => {
                      const IconComponent = skill.icon;
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: skillIndex * 0.1 }}
                          className="relative group/skill"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <IconComponent className={`text-lg ${skill.color}`} />
                              <span className="font-rajdhani font-semibold text-foreground group-hover/skill:text-primary transition-colors duration-300">
                                {skill.name}
                              </span>
                            </div>
                            <span className="text-primary font-bold">
                              {skill.level}%
                            </span>
                          </div>
                          <div className="relative h-2 bg-background/30 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute top-0 h-full bg-gradient-cyber rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: skillIndex * 0.1 }}
                            />
                            <motion.div
                              className="absolute top-0 h-full bg-accent/30 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.5, delay: skillIndex * 0.1 + 0.2 }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="cyber-border p-8 bg-background/20 backdrop-blur-sm">
            <h3 className="font-orbitron text-2xl font-bold text-secondary mb-6 text-center">
              CERTIFICATIONS & ACHIEVEMENTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-4 rounded border border-primary/30 hover:border-primary hover:shadow-glow-cyan transition-all duration-300 group"
                >
                  <div className="w-3 h-3 bg-accent rounded-full animate-neon-pulse group-hover:bg-primary transition-colors duration-300"></div>
                  <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-300 font-rajdhani">
                    {cert}
                  </span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;