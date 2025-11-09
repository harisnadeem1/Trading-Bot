import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Mail, Lock, User, Info, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginUser, signupUser } from "@/api/auth";

const AuthModal = () => {
  const { isAuthModalOpen, authModalView, closeAuthModal, openAuthModal, login, signup } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginEmail, loginPassword);

    if (result.success) {
      const { user } = result;
      toast({ title: `Welcome back, ${user.full_name}!` });
      closeAuthModal();
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      toast({ title: result.message, variant: "destructive" });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }

    const referralCode = localStorage.getItem('referral_code');
    const result = await signupUser(signupName, signupEmail, signupPassword, referralCode);

    if (result.success) {
      const user = result.data;
      toast({ title: `Welcome, ${user.full_name}!` });

      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
      useAuthStore.setState({ currentUser: user, token: user.token });
      localStorage.removeItem('referral_code');

      closeAuthModal();
      navigate("/dashboard");
    } else {
      toast({ title: result.message, variant: "destructive" });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: '🚧 Feature In Progress',
      description: 'Password recovery is not yet implemented.',
    });
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative w-full max-w-[440px] bg-gradient-to-b from-[#1c1c1c] to-[#161616] rounded-3xl shadow-2xl overflow-hidden border border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent pointer-events-none" />
            
            {/* Close button */}
            <button 
              onClick={closeAuthModal}
              className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="relative px-8 pt-12 pb-8">
              

              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {authModalView === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-sm text-gray-400">
                  {authModalView === 'login' 
                    ? 'Enter your credentials to access your account' 
                    : 'Start your trading journey with NovaTrade AI'}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex p-1 bg-white/5 rounded-2xl mb-8">
                <button
                  onClick={() => openAuthModal('login')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    authModalView === 'login'
                      ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    authModalView === 'signup'
                      ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {authModalView === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleLogin} className="space-y-4">
                      <InputField 
                        icon={Mail} 
                        type="email" 
                        placeholder="Email address" 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                      <InputField 
                        icon={Lock} 
                        type={showLoginPassword ? "text" : "password"}
                        placeholder="Password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)}
                        showPassword={showLoginPassword}
                        togglePassword={() => setShowLoginPassword(!showLoginPassword)}
                        required
                      />
                      
                      <div className="flex justify-end -mt-1">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-[1.02] mt-6"
                      >
                        Sign In
                      </Button>
                    </form>

                  
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <form onSubmit={handleSignup} className="space-y-4">
                      <InputField 
                        icon={User} 
                        type="text" 
                        placeholder="Full name" 
                        value={signupName} 
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                      />
                      <InputField 
                        icon={Mail} 
                        type="email" 
                        placeholder="Email address" 
                        value={signupEmail} 
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                      <InputField 
                        icon={Lock} 
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="Password" 
                        value={signupPassword} 
                        onChange={(e) => setSignupPassword(e.target.value)}
                        showPassword={showSignupPassword}
                        togglePassword={() => setShowSignupPassword(!showSignupPassword)}
                        required
                      />
                      <InputField 
                        icon={Lock} 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password" 
                        value={signupConfirmPassword} 
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        showPassword={showConfirmPassword}
                        togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        required
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold py-6 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-[1.02] mt-6"
                      >
                        Create Account
                      </Button>
                    </form>

                    <p className="mt-6 text-[11px] text-center text-gray-500 leading-relaxed">
                      By continuing, you agree to our{' '}
                      <a href="/terms" className="text-green-400 hover:text-green-300 font-medium">Terms</a>
                      {' '}&{' '}
                      <a href="/privacy" className="text-green-400 hover:text-green-300 font-medium">Privacy Policy</a>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InputField = ({ icon: Icon, showPassword, togglePassword, ...props }) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
      <Icon className="w-5 h-5" />
    </div>
    <input 
      {...props}
     className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-all"

    />
    {(props.type === 'password' || (props.type === 'text' && togglePassword)) && (
      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    )}
  </div>
);

export default AuthModal;