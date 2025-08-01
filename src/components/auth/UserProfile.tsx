import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const UserProfile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
    company: user?.company || '',
    jobTitle: user?.jobTitle || '',
    socialLinks: user?.socialLinks || [],
    skills: user?.skills || []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const socialLinks = e.target.value.split(',').map(link => link.trim()).filter(link => link);
    setFormData(prev => ({
      ...prev,
      socialLinks
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      website: user?.website || '',
      location: user?.location || '',
      company: user?.company || '',
      jobTitle: user?.jobTitle || '',
      socialLinks: user?.socialLinks || [],
      skills: user?.skills || []
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>
                Manage your account settings and profile information
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <FaSave className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <FaTimes className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <FaEdit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="space-y-2">
                {isEditing ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold"
                    placeholder="Your name"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.email}</span>
                  {user.emailVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                {user.role === 'admin' && (
                  <Badge variant="destructive" className="text-xs">
                    Administrator
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-3">
                <div>
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.bio || 'No bio added yet.'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Website</Label>
                  {isEditing ? (
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://your-website.com"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.website || 'No website added.'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Location</Label>
                  {isEditing ? (
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Your location"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.location || 'No location added.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Professional Information</h3>
              
              <div className="space-y-3">
                <div>
                  <Label>Company</Label>
                  {isEditing ? (
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.company || 'No company added.'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Job Title</Label>
                  {isEditing ? (
                    <Input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Your job title"
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.jobTitle || 'No job title added.'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Skills (comma-separated)</Label>
                  {isEditing ? (
                    <Input
                      name="skills"
                      value={formData.skills.join(', ')}
                      onChange={handleSkillsChange}
                      placeholder="React, Node.js, TypeScript"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No skills added.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            {isEditing ? (
              <Input
                name="socialLinks"
                value={formData.socialLinks.join(', ')}
                onChange={handleSocialLinksChange}
                placeholder="https://github.com/username, https://linkedin.com/in/username"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.socialLinks && user.socialLinks.length > 0 ? (
                  user.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span>{link}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-muted-foreground">No social links added.</p>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Account Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </div>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile; 