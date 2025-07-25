// Add to imports in BlogList.tsx:
import { FaThumbtack } from 'react-icons/fa';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaSpinner } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      onClose();
      // Reset form
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      await register(registerForm.name, registerForm.email, registerForm.password);
      setShowOTP(true);
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // OTP verification logic would go here
      // For now, just close the modal
      onClose();
      setShowOTP(false);
      setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
      setOtp('');
    } catch (error) {
      // Handle OTP verification error
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTP) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-gradient-cyber">Verify Your Email</DialogTitle>
          </DialogHeader>
          <Card className="cyber-border">
            <CardHeader>
              <CardDescription>
                We've sent a verification code to {registerForm.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOTPVerification} className="space-y-4">
                <div>
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="cyber-input"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="flex-1 cyber-button bg-gradient-cyber"
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Verify Account
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowOTP(false)}
                    className="cyber-button"
                  >
                    Back
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-gradient-cyber">Welcome to Tech Blog</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Login to Your Account</CardTitle>
                <CardDescription>
                  Access all blog features and join the conversation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="cyber-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="cyber-input pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full cyber-button bg-gradient-cyber"
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Login
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full cyber-button">
                    <FaGoogle className="mr-2" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full cyber-button">
                    <FaGithub className="mr-2" />
                    Continue with GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Join our community and start sharing your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="cyber-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="cyber-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        className="cyber-input pr-10"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="cyber-input"
                      required
                    />
                    {registerForm.password !== registerForm.confirmPassword && registerForm.confirmPassword && (
                      <p className="text-sm text-destructive mt-1">Passwords don't match</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || registerForm.password !== registerForm.confirmPassword}
                    className="w-full cyber-button bg-gradient-cyber"
                  >
                    {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full cyber-button">
                    <FaGoogle className="mr-2" />
                    Continue with Google
                  </Button>
                  <Button variant="outline" className="w-full cyber-button">
                    <FaGithub className="mr-2" />
                    Continue with GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;