
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { UserPlus, Mail, KeyRound, User } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    const result = signup(email, password, name);
    if (result.success) {
      toast({ title: "Account created successfully! Welcome." });
      navigate('/dashboard', { replace: true });
    } else {
      toast({ title: result.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - NovaTrade AI</title>
        <meta name="description" content="Create a new account with NovaTrade AI." />
      </Helmet>
      <div className="min-h-screen flex justify-center items-center p-4 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
        >
          <div className="flex flex-col items-center gap-3 mb-6">
            <UserPlus className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl font-bold text-green-400 glow-green">Create Account</h1>
            <p className="text-gray-400">Join the future of AI trading.</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" 
                />
              </div>
            </div>
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
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Sign Up</Button>
          </form>

           <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-400 hover:text-green-300">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
