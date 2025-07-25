import { useState, useEffect } from 'react';
import { testimonialAPI, Testimonial } from '@/services/testimonial.api';
import { useToast } from '@/hooks/use-toast';

export type { Testimonial };

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await testimonialAPI.getTestimonials();
      setTestimonials(response.testimonials);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch testimonials');
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await testimonialAPI.updateTestimonialStatus(id, { status });
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id ? { ...testimonial, status } : testimonial
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update testimonial status",
        variant: "destructive",
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await testimonialAPI.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const submitTestimonial = async (data: {
    name: string;
    email: string;
    role: string;
    company: string;
    content: string;
    rating: number;
  }) => {
    try {
      const response = await testimonialAPI.createTestimonial(data);
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted and is pending approval.",
      });
      return response;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit testimonial",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getApprovedTestimonials = () => {
    return testimonials.filter(t => t.status === 'approved');
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    isLoading,
    error,
    updateTestimonialStatus,
    deleteTestimonial,
    submitTestimonial,
    addTestimonial: submitTestimonial, // Backward compatibility
    getApprovedTestimonials,
    refetch: fetchTestimonials,
  };
};