import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa';
import { SiLeetcode, SiHackerrank } from 'react-icons/si';
import heroBackground from '@/assets/hero-bg.jpg';
import profileAvatar from '@/assets/profile-avatar.jpg';


const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  };

  return (
    <section 
      className="min-h-screen relative flex items-center justify-center cyber-grid"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Avatar */}
          <motion.div
            className="mb-8 flex justify-center"
            variants={itemVariants}
          >
            <motion.div
              className="relative"
              animate={floatingAnimation}
            >
              <div className="w-32 h-32 rounded-full border-4 border-primary shadow-glow-cyan overflow-hidden">
                <img
                  src={profileAvatar}
                  alt="Ashish Jaiswal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-cyber opacity-20 animate-neon-pulse"></div>
            </motion.div>
          </motion.div>

          {/* Name with Glitch Effect */}
          <motion.div variants={itemVariants}>
            <h1 className="font-orbitron text-6xl md:text-8xl font-bold mb-4">
              <span 
                className="glitch-text text-gradient-cyber"
                data-text="ASHISH JAISWAL"
              >
                ASHISH JAISWAL
              </span>
            </h1>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants}>
            <h2 className="font-rajdhani text-2xl md:text-4xl text-primary mb-2 font-bold tracking-wider">
              SOFTWARE ENGINEER
            </h2>
            <div className="w-32 h-1 bg-gradient-cyber mx-auto mb-8 animate-neon-pulse"></div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Full Stack Developer specialized in <span className="text-primary">Java</span>, 
              <span className="text-secondary"> React</span>, and 
              <span className="text-accent"> Node.js</span>. 
              Building the future with cutting-edge technology and innovative solutions.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              className="cyber-button bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <FaEnvelope className="mr-2" />
              HIRE ME
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="cyber-button border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <FaDownload className="mr-2" />
              DOWNLOAD CV
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-6"
            variants={itemVariants}
          >
            {[
              { Icon: FaGithub, href: "https://github.com/ashishjaiswal222", label: "GitHub" },
              { Icon: FaLinkedin, href: "https://www.linkedin.com/in/ashish-jaiswal-developer", label: "LinkedIn" },
              { Icon: SiLeetcode, href: "https://leetcode.com/u/ashishjaiswal22214345/", label: "LeetCode" },
              { Icon: SiHackerrank, href: "https://www.hackerrank.com/profile/ashishjaiswal223", label: "HackerRank" }
            ].map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full border border-primary/30 hover:border-primary transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.95 }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="sr-only">{label}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-primary rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-primary rounded-full mt-2"
                animate={{ height: [12, 6, 12] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>


      {/* Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/20 rounded-lg backdrop-blur-sm"
            style={{
              width: `${Math.random() * 150 + 30}px`,
              height: `${Math.random() * 150 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Holographic Grid Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent transform skew-y-12" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent transform -skew-x-12" />
      </div>
    </section>
  );
};

export default HeroSection;