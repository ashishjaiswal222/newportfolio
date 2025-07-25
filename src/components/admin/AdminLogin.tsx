import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaLock, FaUser } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple authentication for demo
    if (username === 'ashishjaiswal0701@gmail.com' && password === '@fusu649Ib') {
      setTimeout(() => {
        onLogin();
        setLoading(false);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel!",
        });
      }, 1000);
    } else {
      setTimeout(() => {
        setLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }, 1000);
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 cyber-border bg-background/50 focus:shadow-glow-cyan"
                  placeholder="Enter password"
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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