import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, User, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ProjectRating as ProjectRatingType, projectAPI } from '@/services/project.api';

interface ProjectRatingProps {
  projectId: string;
  averageRating: number;
  totalRatings: number;
  ratings: ProjectRatingType[];
  onRatingAdded: (newRating: number) => void;
  requireAuth?: boolean; // Optional: require authentication for rating
}

const ProjectRating: React.FC<ProjectRatingProps> = ({
  projectId,
  averageRating,
  totalRatings,
  ratings,
  onRatingAdded,
  requireAuth = false
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState<ProjectRatingType | null>(null);
  const [userIP, setUserIP] = useState<string>('');
  const { user, isAuthenticated } = useAuth();
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

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to rate this project",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingData = {
        rating: selectedRating,
        userId: user ? user.id : `ip_${userIP}`,
        userName: user ? (user.name || user.email || 'Anonymous User') : `Anonymous User (${userIP.slice(-4)})`,
        userIP: userIP
      };

      const data = await projectAPI.addRating(projectId, ratingData);
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

        {/* Rating Form */}
        {!userRating && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">
                {requireAuth && !isAuthenticated ? 'Login to Rate' : 'Rate this Project'}
              </h4>
              {requireAuth && !isAuthenticated && (
                <p className="text-sm text-foreground/60 mb-3">
                  Please login to rate this project
                </p>
              )}
              <div className="flex justify-center gap-1">
                {renderStars(selectedRating, !requireAuth || isAuthenticated, 'w-8 h-8')}
              </div>
              {selectedRating > 0 && (
                <p className="text-sm text-foreground/70 mt-2">
                  You selected {selectedRating} star{selectedRating !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {(requireAuth ? isAuthenticated : true) && (
              <Button
                onClick={handleSubmitRating}
                disabled={!selectedRating || isSubmitting}
                className="w-full cyber-button bg-gradient-cyber"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
              </Button>
            )}
          </div>
        )}

        {/* User's Previous Rating */}
        {userRating && (
          <div className="text-center p-4 bg-background/20 rounded-lg">
            <p className="text-sm text-foreground/70 mb-2">Your Rating</p>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(userRating.rating, false, 'w-6 h-6')}
            </div>
            <p className="text-xs text-foreground/50">
              Rated on {new Date(userRating.ratedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Recent Ratings */}
        {ratings.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Recent Ratings</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {ratings.slice(0, 5).map((rating, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background/10 rounded">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-foreground/50" />
                    <span className="text-sm font-medium text-foreground">
                      {rating.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(rating.rating, false, 'w-4 h-4')}
                    <span className="text-xs text-foreground/50">
                      {new Date(rating.ratedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProjectRating; 