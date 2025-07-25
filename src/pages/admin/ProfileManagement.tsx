import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, User, FileText, Image } from 'lucide-react';

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState({
    name: 'Your Name',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with expertise in modern web technologies...',
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Your City, Country',
    website: 'https://yourwebsite.com'
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        localStorage.setItem('profileImage', reader.result as string);
        toast({
          title: "Profile Image Updated",
          description: "Your profile image has been successfully uploaded.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a CV smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      setCvFile(file);
      localStorage.setItem('cvFileName', file.name);
      toast({
        title: "CV Uploaded",
        description: "Your CV has been successfully uploaded.",
      });
    }
  };

  const handleProfileUpdate = () => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleDownloadCV = () => {
    if (cvFile) {
      const url = URL.createObjectURL(cvFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = cvFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      toast({
        title: "No CV Available",
        description: "Please upload a CV first.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Profile Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Image & CV */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Image className="h-5 w-5" />
              Media & Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="space-y-4">
              <Label className="text-white">Profile Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden bg-muted">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Max size: 5MB. JPG, PNG, GIF supported.
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>

            {/* CV Upload */}
            <div className="space-y-4">
              <Label className="text-white">CV/Resume</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    onClick={() => cvInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CV
                  </Button>
                  <Button
                    onClick={handleDownloadCV}
                    variant="outline"
                    size="sm"
                    disabled={!cvFile}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                </div>
                {cvFile && (
                  <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{cvFile.name}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Max size: 10MB. PDF, DOC, DOCX supported.
                </p>
              </div>
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={profileData.title}
                  onChange={(e) => setProfileData({...profileData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={handleProfileUpdate} className="w-full">
              Save Profile Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileManagement;