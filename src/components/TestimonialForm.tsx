import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';

const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(2, "Role is required"),
  company: z.string().min(2, "Company name is required"),
  content: z.string().min(10, "Testimonial must be at least 10 characters"),
  rating: z.number().min(1).max(5),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const TestimonialForm = () => {
  const { addTestimonial } = useTestimonials();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
    },
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addTestimonial(data as Required<TestimonialFormData>);

      toast({
        title: "Testimonial Submitted!",
        description: "Thank you for your testimonial. It will be reviewed and published soon.",
      });

      form.reset();
      setSelectedRating(5);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="cyber-border bg-background/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-orbitron text-2xl font-bold text-primary">
            Share Your Experience
          </CardTitle>
          <p className="text-muted-foreground">
            Your testimonial helps others understand the quality of work and collaboration
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Full Name
                </label>
                <Input
                  {...form.register("name")}
                  placeholder="Your full name"
                  className="cyber-border bg-card/50"
                />
                {form.formState.errors.name && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Email Address
                </label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="your.email@company.com"
                  className="cyber-border bg-card/50"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Your Role
                </label>
                <Input
                  {...form.register("role")}
                  placeholder="e.g., Project Manager, CTO"
                  className="cyber-border bg-card/50"
                />
                {form.formState.errors.role && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.role.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Company
                </label>
                <Input
                  {...form.register("company")}
                  placeholder="Your company name"
                  className="cyber-border bg-card/50"
                />
                {form.formState.errors.company && (
                  <p className="text-red-400 text-sm mt-1">{form.formState.errors.company.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className="group"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors duration-200 ${
                        rating <= selectedRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({selectedRating}/5)
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Your Testimonial
              </label>
              <Textarea
                {...form.register("content")}
                placeholder="Share your experience working with me. What made the collaboration successful? How was the project outcome?"
                rows={4}
                className="cyber-border bg-card/50 resize-none"
              />
              {form.formState.errors.content && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your testimonial will be reviewed before being published on the website. 
                We may contact you for verification purposes.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cyber-button bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Testimonial
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialForm;