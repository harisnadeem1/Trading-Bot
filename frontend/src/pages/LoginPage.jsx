
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogIn, Mail, KeyRound, Info } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    const result = login(email, password);
    if (result.success) {
      toast({ title: `Welcome back!` });
      if (result.user.isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from.startsWith('/admin') ? '/dashboard' : from, { replace: true });
      }
    } else {
      toast({ title: result.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Impulse Edge</title>
        <meta name="description" content="Login to your Impulse Edge account." />
      </Helmet>
      <div className="min-h-screen flex justify-center items-center p-4 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <LogIn className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl font-bold text-green-400 glow-green">Welcome Back</h1>
            <p className="text-gray-400">Log in to access your dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" 
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Login</Button>
          </form>

            <div className="mt-6 bg-green-500/10 border border-green-500/20 p-4 rounded-lg text-xs text-gray-300">
                <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold mb-1 text-green-400">Demo Credentials:</p>
                        <p><span className="font-semibold">Admin:</span> admin@novatrade.ai / Admin123!</p>
                        <p><span className="font-semibold">User:</span> user@novatrade.ai / User123!</p>
                    </div>
                </div>
            </div>

           <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-400 hover:text-green-300">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
