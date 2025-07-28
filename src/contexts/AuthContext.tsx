import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '@/services/auth.api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Try to refresh session on mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Try to get user profile (will auto-refresh if needed)
        const userData = await authAPI.getCurrentUser();
        if (isMounted) setUser(userData.admin || userData.user);
      } catch (error: any) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    initAuth();
    return () => { isMounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authAPI.login({ email, password });
      // After login, fetch user profile
      const userData = await authAPI.getCurrentUser();
      setUser(userData.admin || userData.user);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    } catch (error: any) {
      setUser(null);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.user);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Try to refresh session (e.g. after token refresh)
  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData.admin || userData.user);
    } catch (error) {
      setUser(null);
    }
  };

  // Auto-refresh access token on 401 (optional: can be handled in api.ts as well)
  // ...

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};