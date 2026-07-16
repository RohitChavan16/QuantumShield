import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const expiredToast = sessionStorage.getItem('sentinelfuse_toast');
    if (expiredToast) {
      toast({ title: expiredToast, type: 'error' });
      sessionStorage.removeItem('sentinelfuse_toast');
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Allow MOCK_MODE for local dev
      if (import.meta.env.VITE_MOCK_MODE === 'true' || import.meta.env.DEV) {
        await new Promise(r => setTimeout(r, 800)); // simulate latency
        if ((username === 'admin' && password === 'admin123') || (username === 'analyst' && password === 'analyst123')) {
          login({
            token: 'mock-jwt-token',
            role: username === 'admin' ? 'admin' : 'analyst',
            expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hr
          });
          toast({ title: 'Signed in successfully', type: 'success' });
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
          return;
        } else {
          throw new Error('Invalid username or password');
        }
      }

      const res = await api.post('/api/v1/auth/login', { username, password });
      login({
        token: res.data.token,
        role: res.data.role,
        expires_at: res.data.expires_at,
      });
      toast({ title: 'Signed in successfully', type: 'success' });
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401 || err.message) {
        setError('Invalid username or password');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Image */}
      <img src="/finspark_bg.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none" />
      
      {/* Background vignette elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Animated Glowing Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 rounded-xl blur-[3px] animate-pulse pointer-events-none" />
        
        {/* Scanning Laser Line */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-20">
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            className="absolute w-full h-[1px] bg-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
          />
        </div>

        <Card className="w-full relative shadow-[0_0_30px_rgba(6,182,212,0.15)] border-cyan-500/40 bg-surface/85 backdrop-blur-xl rounded-xl">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center mb-2 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] relative">
              <Lock className="w-6 h-6 text-cyan-500 animate-pulse" />
              {/* Radar ring effect */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/40 animate-ping opacity-20" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-text-primary uppercase tracking-wider font-mono">
              QuantumShield
            </CardTitle>
            <p className="text-xs text-cyan-500/80 font-mono tracking-widest uppercase">Secure Access Terminal</p>
          </CardHeader>
          
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-critical/10 border border-critical/20 rounded-md text-critical text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary" htmlFor="username">Username</label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary" htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-cyan-500 hover:bg-cyan-500/90 text-background font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
              size="lg"
              isLoading={isLoading}
              disabled={!username || !password}
            >
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
