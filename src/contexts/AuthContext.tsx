import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User, LoginData, RegisterData, UpdateProfileData } from '@/services/auth.api';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  adminLogin: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
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

  // Check for stored tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (token && refreshToken) {
          // Validate token format before making API call
          if (token.split('.').length === 3) {
            try {
              // Try to get current user
              const userData = await authAPI.getCurrentUser();
              setUser(userData.user);
            } catch (error: any) {
              // If token is invalid (401 or 403), clear storage
              if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
              } else {
                // For other errors, keep the token but set user to null
                setUser(null);
              }
            }
          } else {
            // Invalid token format, clear storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
          }
        } else {
          // No tokens found, user is not authenticated
          setUser(null);
        }
      } catch (error: any) {
        // Clear storage on any error
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
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

  const adminLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.adminLogin(data);
      localStorage.setItem('accessToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
      toast({
        title: "Admin login successful!",
        description: "Welcome to the admin panel.",
      });
    } catch (error: any) {
      setUser(null);
      toast({
        title: "Admin login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(data);
      toast({
        title: "Registration successful!",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Registration failed",
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
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
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

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData.user);
    } catch (error) {
      setUser(null);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      toast({
        title: "Email sent",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.response?.data?.message || "Failed to send password reset email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await authAPI.resetPassword(token, password);
      toast({
        title: "Password reset",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const response = await authAPI.verifyEmail(token);
      toast({
        title: "Email verified",
        description: response.message,
      });
    } catch (error: any) {
      toast({
        title: "Email verification failed",
        description: error.response?.data?.message || "Failed to verify email",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    adminLogin,
    register,
    logout,
    updateProfile,
    refreshUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};