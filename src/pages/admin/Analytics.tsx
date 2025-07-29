import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/useProjects';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useContacts } from '@/hooks/useContacts';

// Import modular analytics components
import DashboardOverview from '@/components/analytics/DashboardOverview';
import ProjectAnalytics from '@/components/analytics/ProjectAnalytics';
import TestimonialAnalytics from '@/components/analytics/TestimonialAnalytics';
import ContactAnalytics from '@/components/analytics/ContactAnalytics';
import TrafficAnalytics from '@/components/analytics/TrafficAnalytics';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const { projects, analytics, fetchProjects, fetchAnalytics } = useProjects();
  const { testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { contacts, isLoading: contactsLoading } = useContacts();

  // Real-time visitor simulation
  const [realTimeVisitors, setRealTimeVisitors] = useState(24);
  
  useEffect(() => {
    fetchProjects();
    fetchAnalytics();
  }, [fetchProjects, fetchAnalytics]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeVisitors(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-gradient-cyber mb-2">
              ANALYTICS DASHBOARD
            </h1>
            <p className="text-foreground/60">Comprehensive insights across all portfolio sections</p>
          </div>
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded cyber-border bg-background text-foreground"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <Link to="/admin">
              <Button variant="outline" className="cyber-button">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Main Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="cyber-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="p-6">
                <DashboardOverview 
                  projects={projects || []}
                  testimonials={testimonials || []}
                  contacts={contacts || []}
                  realTimeVisitors={realTimeVisitors}
                />
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects" className="p-6">
                <ProjectAnalytics timeRange={timeRange} />
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="p-6">
                <TestimonialAnalytics testimonials={testimonials || []} />
              </TabsContent>

              {/* Contacts Tab */}
              <TabsContent value="contacts" className="p-6">
                <ContactAnalytics contacts={contacts || []} />
              </TabsContent>

              {/* Traffic Tab */}
              <TabsContent value="traffic" className="p-6">
                <TrafficAnalytics realTimeVisitors={realTimeVisitors} />
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;