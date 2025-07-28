import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/services/auth.api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);

  const verifyToken = async (resetToken: string) => {
    try {
      await authAPI.verifyResetToken(resetToken);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      toast({
        title: "Invalid token",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(token, newPassword);
      toast({
        title: "Password reset successful",
        description: "Your password has been changed successfully. You can now log in.",
      });
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description: error.response?.data?.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
        <Card className="cyber-border p-8 backdrop-blur-lg bg-background/80">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-foreground/60">Verifying reset token...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-background cyber-grid flex items-center justify-center p-4">
        <Card className="cyber-border p-8 backdrop-blur-lg bg-background/80">
          <div className="text-center">
            <FaTimesCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-orbitron text-2xl font-bold text-destructive mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-foreground/60 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Button
              onClick={() => navigate('/admin')}
              className="cyber-button bg-primary text-primary-foreground"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
              RESET PASSWORD
            </h1>
            <p className="text-foreground/60">Enter your new password</p>
          </motion.div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="newPassword" className="text-foreground font-medium">
                New Password
              </Label>
              <div className="relative mt-2">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-foreground/60 mt-1">Minimum 8 characters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-2">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords don't match</p>
              )}
              {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <FaCheckCircle /> Passwords match
                </p>
              )}
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
                disabled={loading || newPassword !== confirmPassword || newPassword.length < 8}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-background border-t-transparent rounded-full"
                  />
                ) : (
                  "Reset Password"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin')}
                className="w-full cyber-border text-foreground/60 hover:text-foreground"
              >
                Back to Login
              </Button>
            </motion.div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword; 