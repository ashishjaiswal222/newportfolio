import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaLock, FaUser, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/auth.api';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      onLogin();
    } catch (error) {
      // Error handled by AuthContext toast
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await authAPI.forgotPassword(resetEmail);
      toast({
        title: "Reset link sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: "Reset link sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="cyber-border p-8 backdrop-blur-lg bg-background/80">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
              <FaLock className="text-2xl text-background" />
            </div>
            <h1 className="font-orbitron text-3xl font-bold text-gradient-cyber mb-2">
              ADMIN ACCESS
            </h1>
            <p className="text-foreground/60">Enter your credentials to continue</p>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <div className="relative mt-2">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                  placeholder="Enter username"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative mt-2">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <Button
                type="submit"
                className="w-full cyber-button bg-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                  />
                ) : (
                  "ACCESS GRANTED"
                )}
              </Button>

              <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cyber-border text-foreground/60 hover:text-foreground"
                  >
                    Forgot Password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="cyber-border bg-background/95 backdrop-blur-lg">
                  <DialogHeader>
                    <DialogTitle className="font-orbitron text-gradient-cyber">
                      Reset Password
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="reset-email" className="text-foreground font-medium">
                        Email Address
                      </Label>
                      <div className="relative mt-2">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="pl-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full cyber-button bg-primary text-primary-foreground"
                      disabled={resetLoading}
                    >
                      {resetLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                        />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-sm text-foreground/60"
          >
            Enter your admin credentials to access the panel
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;