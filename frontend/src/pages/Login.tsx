import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Shield } from 'lucide-react';
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
      {/* Background vignette elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-border/50 bg-surface/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2 border border-accent/20 shadow-glow">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-text-primary">
            QuantumShield
          </CardTitle>
          <p className="text-sm text-text-muted">Cyber-Fraud Fusion Platform</p>
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
              className="w-full mt-6"
              size="lg"
              isLoading={isLoading}
              disabled={!username || !password}
            >
              Sign In
            </Button>
            
            <div className="mt-6 pt-6 border-t border-border/50 text-center">
              <p className="text-xs text-text-muted mb-2">Demo credentials</p>
              <div className="flex justify-center gap-4 text-xs font-mono text-text-secondary">
                <span>analyst / analyst123</span>
                <span>admin / admin123</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
