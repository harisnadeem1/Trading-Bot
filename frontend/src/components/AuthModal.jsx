
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Mail, KeyRound, User, Info } from 'lucide-react';
import { loginUser, signupUser } from "@/api/auth";

const AuthModal = () => {
  const { isAuthModalOpen, authModalView, closeAuthModal, openAuthModal, login, signup } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // ✅ LOGIN HANDLER
// ✅ LOGIN HANDLER
const handleLogin = async (e) => {
  e.preventDefault();

  const result = await login(loginEmail, loginPassword); // 👈 use the store's function

  if (result.success) {
    const { user } = result;
    toast({ title: `Welcome back, ${user.full_name}!` });
    closeAuthModal();

    console.log("✅ Logged in user:", user); // debug
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
  } else {
    toast({ title: result.message, variant: "destructive" });
  }
};


// ✅ SIGNUP HANDLER (Fixed)
const handleSignup = async (e) => {
  e.preventDefault();

  if (signupPassword !== signupConfirmPassword) {
    toast({ title: "Passwords do not match", variant: "destructive" });
    return;
  }

  const referralCode = localStorage.getItem('referral_code');
  const result = await signupUser(signupName, signupEmail, signupPassword, referralCode);

  if (result.success) {
    const user = result.data; // ✅ Correct key (not result.user)
    toast({ title: `Welcome, ${user.full_name}!` });

    // ✅ Save user and token locally so Zustand state updates
    localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Update Zustand auth store (so PrivateRoute/AdminRoute works immediately)
    useAuthStore.setState({ currentUser: user, token: user.token });

    // ✅ Clear referral code after signup
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
      description: 'Password recovery is not yet implemented. Please contact support if you need assistance.',
    });
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md m-4 bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={closeAuthModal}>
              <X />
            </Button>
            
            <Tabs value={authModalView} onValueChange={(val) => openAuthModal(val)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-green-500/20">
                <TabsTrigger value="login" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <InputField icon={Mail} type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  <InputField icon={KeyRound} type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Login</Button>
                  <p className="text-xs text-right text-gray-400 hover:text-green-400 cursor-pointer" onClick={handleForgotPassword}>Forgot Password?</p>
                </form>
                <div className="mt-4 bg-green-500/10 border border-green-500/20 p-3 rounded-lg text-xs text-gray-300">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1 text-green-400">Demo Accounts:</p>
                            <p><span className="font-semibold">Admin:</span> admin@novatrade.ai / Admin123!</p>
                            <p><span className="font-semibold">User:</span> user@novatrade.ai / User123!</p>
                        </div>
                    </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <InputField icon={User} type="text" placeholder="Full Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                  <InputField icon={Mail} type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  <InputField icon={KeyRound} type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  <InputField icon={KeyRound} type="password" placeholder="Confirm Password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} />
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
    <input 
      {...props}
      className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60 transition-colors" 
    />
  </div>
);

export default AuthModal;
