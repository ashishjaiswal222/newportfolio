import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { Check, X, Star, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TestimonialManagement = () => {
  const { testimonials, updateTestimonialStatus, deleteTestimonial, isLoading } = useTestimonials();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { toast } = useToast();

  const filteredTestimonials = testimonials.filter(t => 
    filter === 'all' || t.status === filter
  );

  const handleApprove = (id: string) => {
    updateTestimonialStatus(id, 'approved');
    toast({
      title: "Testimonial Approved",
      description: "The testimonial is now visible on your portfolio.",
    });
  };

  const handleReject = (id: string) => {
    updateTestimonialStatus(id, 'rejected');
    toast({
      title: "Testimonial Rejected",
      description: "The testimonial has been rejected.",
    });
  };

  const handleDelete = (id: string) => {
    deleteTestimonial(id);
    toast({
      title: "Testimonial Deleted",
      description: "The testimonial has been permanently deleted.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Testimonial Management</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status} ({testimonials.filter(t => status === 'all' || t.status === status).length})
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <Card className="bg-card/50 border-border">
            <CardContent className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading testimonials...</p>
            </CardContent>
          </Card>
        ) : filteredTestimonials.length === 0 ? (
          <Card className="bg-card/50 border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No testimonials found for the selected filter.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 border-border hover:bg-card/70 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl text-white">{testimonial.name}</CardTitle>
                      <Badge className={getStatusColor(testimonial.status)}>
                        {testimonial.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <p className="text-sm text-muted-foreground">{testimonial.email}</p>
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({testimonial.rating}/5)
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {testimonial.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(testimonial.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(testimonial.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(testimonial.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <blockquote className="text-muted-foreground italic border-l-4 border-primary/30 pl-4">
                  "{testimonial.content}"
                </blockquote>
                <p className="text-xs text-muted-foreground mt-4">
                  Submitted on: {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialManagement;