import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { FaEdit, FaSave, FaEye, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

const ContentManagement = () => {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState({
    name: 'ASHISH JAISWAL',
    title: 'SOFTWARE ENGINEER',
    description: 'Full Stack Developer specialized in Java, React, and Node.js. Building the future with cutting-edge technology and innovative solutions.',
    email: 'ashishjaiswal0701@gmail.com',
    phone: '+91 6394860044',
    location: 'Mumbai, Maharashtra, India',
    github: 'https://github.com/ashishjaiswal222',
    linkedin: 'https://www.linkedin.com/in/ashish-jaiswal-developer',
    leetcode: 'https://leetcode.com/u/ashishjaiswal22214345/',
    hackerrank: 'https://www.hackerrank.com/profile/ashishjaiswal223'
  });

  const [aboutContent, setAboutContent] = useState({
    summary: 'I am a passionate Full Stack Developer currently pursuing BCA from Tilak Maharashtra Vidyapeeth, Pune with a CGPA of 8.2. Specialized in Java, React, Node.js, and modern web technologies.',
    education: 'BCA - Tilak Maharashtra Vidyapeeth (2023 - Present) | CGPA: 8.2',
    institute: 'Institute of Business and Research, CBD Belapur'
  });

  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'IoT-Based Smart Plant Monitoring',
      description: 'Created a Smart Plant IoT system utilizing full-stack web development and IoT integration to monitor and manage plant care in real-time via a web application and hardware components.',
      technologies: ['JavaScript', 'Node.js', 'Express.js', 'PostgreSQL', 'D3.js', 'Tailwind CSS', 'WebSocket'],
      period: 'Jan 2023 - April 2023',
      github: '#',
      demo: '#'
    },
    {
      id: 2,
      title: 'Real-Time Environmental Monitoring - airVibe',
      description: 'Developed a real-time environmental monitoring system that tracks air quality (CO2, NH3, CO, AQI) and weather data using Arduino sensors and OpenWeatherMap API.',
      technologies: ['Node.js', 'Express.js', 'PostgreSQL', 'Chart.js', 'WebSocket', 'Arduino', 'JWT'],
      period: 'Feb 2024 - April 2024',
      github: '#',
      demo: '#'
    }
  ]);

  const handleSavePersonalInfo = () => {
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handleSaveAbout = () => {
    toast({
      title: "About Content Updated", 
      description: "Your about section has been saved successfully.",
    });
  };

  const handleSaveProject = (projectId: number) => {
    toast({
      title: "Project Updated",
      description: `Project ${projectId} has been saved successfully.`,
    });
  };

  const addNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      title: 'New Project',
      description: 'Project description...',
      technologies: ['React'],
      period: '2024',
      github: '#',
      demo: '#'
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-gradient-cyber mb-2">
              CONTENT MANAGEMENT
            </h1>
            <p className="text-foreground/60">Manage your portfolio content and information</p>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="cyber-button">
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </motion.div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 cyber-border">
            <TabsTrigger value="personal" className="cyber-button-sm">Personal Info</TabsTrigger>
            <TabsTrigger value="about" className="cyber-button-sm">About</TabsTrigger>
            <TabsTrigger value="projects" className="cyber-button-sm">Projects</TabsTrigger>
            <TabsTrigger value="preview" className="cyber-button-sm">
              <FaEye className="mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-primary mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={personalInfo.title}
                      onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Professional Description</Label>
                    <Textarea
                      id="description"
                      value={personalInfo.description}
                      onChange={(e) => setPersonalInfo({...personalInfo, description: e.target.value})}
                      className="cyber-border h-32"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-orbitron text-lg font-bold text-secondary mb-4">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={personalInfo.github}
                      onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leetcode">LeetCode</Label>
                    <Input
                      id="leetcode"
                      value={personalInfo.leetcode}
                      onChange={(e) => setPersonalInfo({...personalInfo, leetcode: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hackerrank">HackerRank</Label>
                    <Input
                      id="hackerrank"
                      value={personalInfo.hackerrank}
                      onChange={(e) => setPersonalInfo({...personalInfo, hackerrank: e.target.value})}
                      className="cyber-border"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePersonalInfo} className="mt-6 cyber-button bg-primary">
                <FaSave className="mr-2" />
                Save Personal Information
              </Button>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-primary mb-6">About Section</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={aboutContent.summary}
                    onChange={(e) => setAboutContent({...aboutContent, summary: e.target.value})}
                    className="cyber-border h-32"
                    placeholder="Write your professional summary..."
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education Details</Label>
                  <Input
                    id="education"
                    value={aboutContent.education}
                    onChange={(e) => setAboutContent({...aboutContent, education: e.target.value})}
                    className="cyber-border"
                  />
                </div>
                <div>
                  <Label htmlFor="institute">Institute Name</Label>
                  <Input
                    id="institute"
                    value={aboutContent.institute}
                    onChange={(e) => setAboutContent({...aboutContent, institute: e.target.value})}
                    className="cyber-border"
                  />
                </div>
              </div>

              <Button onClick={handleSaveAbout} className="mt-6 cyber-button bg-primary">
                <FaSave className="mr-2" />
                Save About Content
              </Button>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-orbitron text-2xl font-bold text-primary">Project Management</h3>
                <Button onClick={addNewProject} className="cyber-button bg-secondary">
                  Add New Project
                </Button>
              </div>

              {projects.map((project, index) => (
                <Card key={project.id} className="cyber-border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${project.id}`}>Project Title</Label>
                        <Input
                          id={`title-${project.id}`}
                          value={project.title}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, title: e.target.value} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`period-${project.id}`}>Time Period</Label>
                        <Input
                          id={`period-${project.id}`}
                          value={project.period}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, period: e.target.value} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`github-${project.id}`}>GitHub Link</Label>
                        <Input
                          id={`github-${project.id}`}
                          value={project.github}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, github: e.target.value} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`demo-${project.id}`}>Demo Link</Label>
                        <Input
                          id={`demo-${project.id}`}
                          value={project.demo}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, demo: e.target.value} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`description-${project.id}`}>Project Description</Label>
                        <Textarea
                          id={`description-${project.id}`}
                          value={project.description}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, description: e.target.value} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border h-32"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`technologies-${project.id}`}>Technologies (comma separated)</Label>
                        <Textarea
                          id={`technologies-${project.id}`}
                          value={project.technologies.join(', ')}
                          onChange={(e) => {
                            const updatedProjects = projects.map(p => 
                              p.id === project.id ? {...p, technologies: e.target.value.split(', ')} : p
                            );
                            setProjects(updatedProjects);
                          }}
                          className="cyber-border h-20"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleSaveProject(project.id)} 
                    className="mt-4 cyber-button bg-primary"
                  >
                    <FaSave className="mr-2" />
                    Save Project {project.id}
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="cyber-border p-8">
              <h3 className="font-orbitron text-2xl font-bold text-primary mb-6">Live Preview</h3>
              <div className="space-y-6">
                <div className="border border-primary/30 rounded-lg p-6 bg-background/50">
                  <h4 className="font-orbitron text-xl font-bold text-gradient-cyber mb-2">
                    {personalInfo.name}
                  </h4>
                  <p className="text-secondary font-bold mb-2">{personalInfo.title}</p>
                  <p className="text-foreground/80 mb-4">{personalInfo.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><strong>Email:</strong> {personalInfo.email}</p>
                    <p><strong>Phone:</strong> {personalInfo.phone}</p>
                    <p><strong>Location:</strong> {personalInfo.location}</p>
                  </div>
                </div>
                
                <div className="border border-primary/30 rounded-lg p-6 bg-background/50">
                  <h4 className="font-orbitron text-lg font-bold text-secondary mb-4">About</h4>
                  <p className="text-foreground/80 mb-2">{aboutContent.summary}</p>
                  <p className="text-sm text-foreground/60">{aboutContent.education}</p>
                  <p className="text-sm text-foreground/60">{aboutContent.institute}</p>
                </div>

                <Link to="/">
                  <Button className="cyber-button bg-accent">
                    <FaEye className="mr-2" />
                    View Full Portfolio
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentManagement;