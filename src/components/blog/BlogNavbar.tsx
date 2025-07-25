import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthModal from '@/components/auth/AuthModal';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaEdit } from 'react-icons/fa';

const BlogNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/blogs');
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/blogs" className="font-orbitron text-xl font-bold text-gradient-cyber">
              TechBlog
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                <FaHome className="text-sm" />
                <span>Portfolio</span>
              </Link>
              <Link 
                to="/blogs" 
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Blogs
              </Link>
              <Link 
                to="/projects" 
                className="text-foreground/70 hover:text-foreground transition-colors"
              >
                Projects
              </Link>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  {/* Write Button for authenticated users */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/write')}
                    className="cyber-button hidden sm:flex"
                  >
                    <FaEdit className="mr-2" />
                    Write
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-cyber text-white">
                            {user.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <FaUser className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <FaCog className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <FaCog className="mr-2 h-4 w-4" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                    className="cyber-button"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAuthClick('register')}
                    className="cyber-button bg-gradient-cyber"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authMode}
      />
    </>
  );
};

export default BlogNavbar;