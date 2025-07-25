import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, BookOpen, Heart, MessageCircle, Bookmark, Star } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
  title?: string;
  message?: string;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  title = "Unlock Full Blog Experience",
  message = "Create an account to access all blog features"
}) => {
  const features = [
    {
      icon: BookOpen,
      title: "Read All Blogs",
      description: "Access complete blog content and exclusive posts"
    },
    {
      icon: MessageCircle,
      title: "Comment & Discuss",
      description: "Join conversations and share your thoughts"
    },
    {
      icon: Heart,
      title: "Like & React",
      description: "Show appreciation for content you love"
    },
    {
      icon: Bookmark,
      title: "Save for Later",
      description: "Bookmark articles to read later"
    },
    {
      icon: Star,
      title: "Get Recommendations",
      description: "Personalized content based on your interests"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-3">
            <CardDescription className="text-base">
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Features List */}
            <div className="space-y-3">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{feature.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button 
                onClick={onRegister}
                className="w-full"
                size="lg"
              >
                Create Free Account
              </Button>
              
              <Button 
                onClick={onLogin}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Sign In
              </Button>
            </div>

            {/* Benefits Footer */}
            <div className="text-center pt-2">
              <p className="text-xs text-muted-foreground">
                ✨ Free forever • No spam • Join {Math.floor(Math.random() * 5000) + 1000}+ developers
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredModal;