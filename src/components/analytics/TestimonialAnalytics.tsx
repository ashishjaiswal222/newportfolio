import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { FaUsers } from 'react-icons/fa';
import { Testimonial } from '@/hooks/useTestimonials';

interface TestimonialAnalyticsProps {
  testimonials: Testimonial[];
  isLoading: boolean;
}

const TestimonialAnalytics: React.FC<TestimonialAnalyticsProps> = ({ testimonials, isLoading }) => {
  const totalTestimonials = testimonials.length;
  const approved = testimonials.filter(t => t.status === 'approved').length;
  const pending = testimonials.filter(t => t.status === 'pending').length;
  const rejected = testimonials.filter(t => t.status === 'rejected').length;
  const approvalRate = totalTestimonials > 0 ? Math.round((approved / totalTestimonials) * 100) : 0;
  const averageRating = approved > 0 ? (
    testimonials.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.rating, 0) / approved
  ).toFixed(2) : 'N/A';

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="cyber-border p-6 bg-gradient-to-r from-yellow-900/10 to-yellow-400/10 mb-6">
          <h3 className="font-orbitron text-xl font-bold text-yellow-400 mb-6 flex items-center">
            <FaUsers className="mr-2" />
            Testimonial Analytics
          </h3>
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">Loading testimonial analytics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{totalTestimonials}</div>
                <div className="text-sm text-foreground/60">Total Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{approved}</div>
                <div className="text-sm text-foreground/60">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{pending}</div>
                <div className="text-sm text-foreground/60">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{rejected}</div>
                <div className="text-sm text-foreground/60">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{approvalRate}%</div>
                <div className="text-sm text-foreground/60">Approval Rate</div>
              </div>
              <div className="text-center col-span-1 md:col-span-2 lg:col-span-1">
                <div className="text-2xl font-bold text-yellow-300">{averageRating}</div>
                <div className="text-sm text-foreground/60">Avg. Rating (Approved)</div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default TestimonialAnalytics; 