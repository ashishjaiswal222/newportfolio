import React, { useState, useEffect } from 'react';
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
import { authAPI } from '@/services/auth.api';
import { blogAPI } from '@/services/blog.api'; // Assume this exists for fetching blogs by ID

const UserProfile = () => {
  const { user, updateProfile, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });
  const [stats, setStats] = useState([
    { label: 'Posts Read', value: 0, icon: FaEye },
    { label: 'Likes Given', value: 0, icon: FaHeart },
    { label: 'Comments', value: 0, icon: FaComment },
    { label: 'Bookmarks', value: 0, icon: FaBookmark },
  ]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<any[]>([]);
  const [userComments, setUserComments] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    // Fetch user stats, bookmarks, comments, and activity
    const fetchUserData = async () => {
      try {
        // Refresh user to get latest info
        await refreshUser();
        // Get bookmarks (blog IDs)
        const bookmarks = user.bookmarkedBlogs || [];
        // Fetch blog details for bookmarks
        const blogs = await Promise.all(
          bookmarks.map(async (id: string) => {
            try {
              const res = await blogAPI.getBlog(id);
              return res;
            } catch {
              return null;
            }
          })
        );
        setBookmarkedBlogs(blogs.filter(Boolean));
        // Fetch user comments
        const commentsRes = await authAPI.getUserComments();
        setUserComments(commentsRes.comments || []);
        // Fetch user activity (likes, comments, bookmarks, etc.)
        const activityRes = await authAPI.getUserActivity();
        setActivity(activityRes.activity || []);
        // Set stats
        setStats([
          { label: 'Posts Read', value: user.postsRead?.length || 0, icon: FaEye },
          { label: 'Likes Given', value: user.likedBlogs?.length || 0, icon: FaHeart },
          { label: 'Comments', value: commentsRes.comments?.length || 0, icon: FaComment },
          { label: 'Bookmarks', value: bookmarks.length, icon: FaBookmark },
        ]);
      } catch (err) {
        // handle error
      }
    };
    fetchUserData();
  }, [user]);

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
                    {activity.length === 0 && <p className="text-foreground/60">No recent activity.</p>}
                    {activity.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                        {/* Render activity type and details */}
                        {/* Example: Like, Comment, Bookmark, etc. */}
                        {item.type === 'like' && <FaHeart className="text-red-500" />}
                        {item.type === 'comment' && <FaComment className="text-blue-500" />}
                        {item.type === 'bookmark' && <FaBookmark className="text-yellow-500" />}
                        <div>
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-foreground/60">{item.timeAgo}</p>
                        </div>
                      </div>
                    ))}
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
                  {bookmarkedBlogs.length === 0 ? (
                    <p className="text-foreground/60">Your bookmarked articles will appear here.</p>
                  ) : (
                    <div className="space-y-4">
                      {bookmarkedBlogs.map((blog, idx) => (
                        <div key={blog.id || idx} className="border-b border-border pb-2 mb-2">
                          <div className="font-bold">{blog.title}</div>
                          <div className="text-sm text-foreground/60">{blog.excerpt}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle>Your Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  {userComments.length === 0 ? (
                    <p className="text-foreground/60">Your comments will appear here.</p>
                  ) : (
                    <div className="space-y-4">
                      {userComments.map((comment, idx) => (
                        <div key={comment.id || idx} className="border-b border-border pb-2 mb-2">
                          <div className="font-bold">On: {comment.blogTitle}</div>
                          <div className="text-sm text-foreground/60">{comment.content}</div>
                          <div className="text-xs text-foreground/40">{comment.createdAt}</div>
                        </div>
                      ))}
                    </div>
                  )}
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