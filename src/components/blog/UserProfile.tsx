import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FaUser, FaHeart, FaBookmark, FaComment, FaEye, FaEdit, FaCalendar } from 'react-icons/fa';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    location: '',
    website: '',
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      // Error handled by AuthContext
    }
  };

  if (!user) {
    return null;
  }

  const stats = [
    { label: 'Posts Read', value: 24, icon: FaEye },
    { label: 'Likes Given', value: 156, icon: FaHeart },
    { label: 'Comments', value: 42, icon: FaComment },
    { label: 'Bookmarks', value: 18, icon: FaBookmark },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card className="cyber-border">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gradient-cyber text-white text-2xl">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-orbitron text-2xl font-bold text-foreground">
                        {user.name}
                      </h1>
                      <p className="text-foreground/70">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">{user.role}</Badge>
                        <div className="flex items-center text-sm text-foreground/60">
                          <FaCalendar className="mr-1" />
                          Joined Dec 2024
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                      className="cyber-button"
                    >
                      <FaEdit className="mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="cyber-border">
                <CardContent className="p-4 text-center">
                  <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Profile Content */}
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            className="cyber-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="cyber-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            className="cyber-input"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            className="cyber-input"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          className="w-full p-3 border border-border rounded-md bg-background cyber-input"
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" className="cyber-button bg-gradient-cyber">
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="cyber-button"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-foreground/60">Full Name</Label>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-foreground/60">Email</Label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-foreground/60">Role</Label>
                          <p className="font-medium capitalize">{user.role}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-foreground/60">Status</Label>
                          <p className="font-medium text-green-500">Active</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <FaHeart className="text-red-500" />
                      <div>
                        <p className="font-medium">Liked "Building Scalable Microservices"</p>
                        <p className="text-sm text-foreground/60">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <FaComment className="text-blue-500" />
                      <div>
                        <p className="font-medium">Commented on "AI-Powered Code Generation"</p>
                        <p className="text-sm text-foreground/60">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                      <FaBookmark className="text-yellow-500" />
                      <div>
                        <p className="font-medium">Bookmarked "React Performance Optimization"</p>
                        <p className="text-sm text-foreground/60">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle>Bookmarked Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/60">Your bookmarked articles will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle>Your Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/60">Your comments will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;