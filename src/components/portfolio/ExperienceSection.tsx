import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const ExperienceSection = () => {
  const experiences = [
    {
      title: "Campus Ambassador",
      organization: "E-Summit IIT Bombay",
      period: "2024 - 2025",
      description: "Selected as Campus Ambassador for E-Summit, one of Asia's largest entrepreneurship summits. Responsible for promoting entrepreneurial activities and managing campus outreach.",
      skills: ["Leadership", "Event Management", "Marketing", "Communication"]
    },
    {
      title: "Contingent Leader", 
      organization: "Mood Indigo & TechFest IIT Bombay",
      period: "2023 - 2024",
      description: "Led the entire college team at Asia's largest cultural and technology festivals. Managed team coordination, logistics, and represented the college at prestigious events.",
      skills: ["Team Management", "Coordination", "Problem Solving", "Leadership"]
    },
    {
      title: "Class Representative",
      organization: "Tilak Maharashtra Vidyapeeth",
      period: "2023 - Present",
      description: "Elected as Class Representative for 2nd and 3rd semester. Facilitated communication between students and faculty, organized academic events, and maintained class coordination.",
      skills: ["Communication", "Organization", "Mediation", "Academic Planning"]
    },
    {
      title: "Best Volunteer",
      organization: "College Activities",
      period: "2024",
      description: "Recognized as Best Volunteer of the Year for outstanding contribution to college activities, events, and community service initiatives.",
      skills: ["Volunteering", "Community Service", "Event Support", "Dedication"]
    }
  ];

  const achievements = [
    "🏆 Contingent Leader - Mood Indigo & TechFest 2023-24 (IIT Bombay)",
    "🎯 Campus Ambassador - E-Summit 2024 & 2025 (IIT Bombay)",
    "📊 Ranked top 6 among all students in Semester 3",
    "💻 Participated in Hackathons (2 times)",
    "🥈 2nd Prize - Best Projects in IT Forum (First Year)",
    "⭐ Best Volunteer of the Year (2024)",
    "👥 Class Representative (2nd & 3rd Semester)",
    "♟️ Chess Semi-Finalist (2 times)",
    "🤸 Gymnastics & Badminton Player",
    "🎭 Euphoria Cultural Fest Participant - Act and Dance (2025)",
    "🎓 Mood Indigo Contingent Leader Certificate 53rd Edition"
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
            EXPERIENCE & ACHIEVEMENTS
          </h2>
          <div className="w-32 h-1 bg-gradient-cyber mx-auto"></div>
        </motion.div>

        {/* Experience Timeline */}
        <div className="mb-16">
          <h3 className="font-orbitron text-2xl font-bold text-secondary mb-8 text-center">
            LEADERSHIP EXPERIENCE
          </h3>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="cyber-border p-6 hover:glow-purple transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <div className="text-center md:text-left">
                        <h4 className="font-orbitron text-lg font-bold text-primary">
                          {exp.title}
                        </h4>
                        <p className="text-accent font-medium">{exp.organization}</p>
                        <p className="text-foreground/60 text-sm">{exp.period}</p>
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <p className="text-foreground/80 mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium border border-secondary/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-orbitron text-2xl font-bold text-secondary mb-8 text-center">
            KEY ACHIEVEMENTS
          </h3>
          <Card className="cyber-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded border border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-accent rounded-full animate-neon-pulse flex-shrink-0"></div>
                  <span className="text-foreground/80">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Card className="cyber-border p-8 text-center">
            <h3 className="font-orbitron text-2xl font-bold text-primary mb-4">
              ADDITIONAL SKILLS
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {["Figma", "Excel", "Video Editing", "Networking", "Problem Solving", "Team Leadership", "Event Management", "Public Speaking"].map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium border border-primary/30 hover:bg-primary/30 transition-colors duration-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;