import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BlogNavbar from '@/components/blog/BlogNavbar';
import UserProfile from '@/components/blog/UserProfile';

const UserProfilePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogNavbar />
      <div className="pt-20">
        <UserProfile />
      </div>
    </div>
  );
};

export default UserProfilePage;