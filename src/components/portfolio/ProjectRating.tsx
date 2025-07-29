import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, User, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProjectRating as ProjectRatingType } from '@/services/project.api';

interface ProjectRatingProps {
  projectId: string;
  averageRating: number;
  totalRatings: number;
  ratings: ProjectRatingType[];
  onRatingAdded: (newRating: number) => void;
}

const ProjectRating: React.FC<ProjectRatingProps> = ({
  projectId,
  averageRating,
  totalRatings,
  ratings,
  onRatingAdded
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<ProjectRatingType | null>(null);
  const [userIP, setUserIP] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  // Get user IP address for anonymous rating tracking
  useEffect(() => {
    const getUserIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
      } catch (error) {
        console.error('Failed to get IP address:', error);
        // Fallback to a random identifier for demo purposes
        setUserIP(`anonymous_${Math.random().toString(36).substr(2, 9)}`);
      }
    };
    getUserIP();
  }, []);

  // Check if user has already rated (by IP for anonymous users, by userId for logged users)
  useEffect(() => {
    if (ratings && userIP) {
      const existingRating = ratings.find(r => 
        (user && r.userId === user.id) || 
        (!user && r.userId === `ip_${userIP}`)
      );
      if (existingRating) {
        setUserRating(existingRating);
        setSelectedRating(existingRating.rating);
      }
    }
  }, [user, ratings, userIP]);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (!selectedRating || !userIP) return;

    setIsSubmitting(true);
    try {
      const ratingData = {
        rating: selectedRating,
        userId: user ? user.id : `ip_${userIP}`,
        userName: user ? (user.name || user.email || 'Anonymous User') : `Anonymous User (${userIP.slice(-4)})`,
        userIP: userIP
      };

      const response = await fetch(`/api/projects/${projectId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }

      const data = await response.json();
      onRatingAdded(selectedRating);
      
      toast({
        title: "Rating Submitted!",
        description: `Thank you for rating this project ${selectedRating} stars!`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isHovered = interactive && starValue <= hoveredRating;
      
      return (
        <motion.div
          key={index}
          className={`cursor-pointer transition-colors ${
            isFilled || isHovered ? 'text-yellow-400' : 'text-gray-400'
          }`}
          onMouseEnter={() => interactive && setHoveredRating(starValue)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          onClick={() => interactive && handleStarClick(starValue)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Star className={size} fill={isFilled || isHovered ? 'currentColor' : 'none'} />
        </motion.div>
      );
    });
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Below Average';
    return 'Poor';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-blue-400';
    if (rating >= 3.5) return 'text-yellow-400';
    if (rating >= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="cyber-border p-6">
      <div className="space-y-6">
        {/* Rating Summary */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {renderStars(averageRating, false, 'w-6 h-6')}
            <span className={`text-2xl font-bold ml-2 ${getRatingColor(averageRating)}`}>
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className={`text-foreground/80 mb-1 ${getRatingColor(averageRating)}`}>
            {getRatingText(averageRating)}
          </p>
          <p className="text-sm text-foreground/60">
            Based on {totalRatings} rating{totalRatings !== 1 ? 's' : ''}
          </p>
        </div>

        <Separator />

        {/* User Rating Section */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-lg font-bold text-primary">
            {userRating ? 'Your Rating' : 'Rate this Project'}
          </h3>
          
          <div className="flex items-center justify-center gap-1">
            {renderStars(selectedRating, !userRating, 'w-8 h-8')}
          </div>
          
          {selectedRating > 0 && (
            <p className="text-center text-foreground/80">
              {userRating ? 'You rated this project' : 'You selected'} {selectedRating} star{selectedRating !== 1 ? 's' : ''}
            </p>
          )}

          {!userRating && selectedRating > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleSubmitRating}
                disabled={isSubmitting}
                className="cyber-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </div>
          )}

          {userRating && (
            <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-foreground/80">
                You rated this project on{' '}
                {new Date(userRating.ratedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Rating Guidelines */}
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-foreground/70">
                <p className="font-semibold mb-1">Rating Guidelines:</p>
                <p>⭐ 1-2: Needs improvement</p>
                <p>⭐⭐ 3: Average</p>
                <p>⭐⭐⭐ 4: Good</p>
                <p>⭐⭐⭐⭐ 5: Excellent</p>
                <p className="mt-1 text-blue-400">One rating per IP address to prevent spam.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Ratings */}
        {ratings && ratings.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="font-orbitron text-lg font-bold text-primary mb-4">
                Recent Ratings
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ratings.slice(0, 5).map((rating, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {rating.userName}
                        </p>
                        <div className="flex items-center gap-1">
                          {renderStars(rating.rating, false, 'w-3 h-3')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-foreground/60">
                        {new Date(rating.ratedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ProjectRating; 