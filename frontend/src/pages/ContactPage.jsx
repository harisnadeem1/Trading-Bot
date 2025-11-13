
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Phone, MapPin, User, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactPage = () => {
  const { toast } = useToast();

  const handleSendMessage = (e) => {
    e.preventDefault();
    toast({
      title: 'Message Sent!',
      description: "We've received your message and will get back to you shortly.",
    });
    e.target.reset();
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Impulse Edge</title>
        <meta name="description" content="Get in touch with the Impulse Edge team for support, inquiries, or partnerships." />
      </Helmet>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Get in <span className="text-green-400 glow-green">Touch</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Questions, business inquiries, or partnership requests — we’d love to hear from you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-3 bg-gradient-to-br from-gray-900 to-green-950/20 border border-green-500/30 rounded-2xl p-8 card-glow"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Send className="w-6 h-6 text-green-400" />
                  Send us a Message
                </h2>
                <form onSubmit={handleSendMessage} className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name</label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                       <input required type="text" placeholder="Your Name" className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                       <input required type="email" placeholder="Your Email" className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Message</label>
                     <div className="relative">
                       <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-gray-500" />
                       <textarea required placeholder="Your Message..." rows="5" className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-green-500/60"></textarea>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 flex items-center gap-2 group">
                    Send Message
                    <motion.div
                        className="transition-transform"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    >
                        <Send className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-2 space-y-8"
              >
                  <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 card-glow">
                    <div className="p-3 bg-green-500/10 rounded-lg"><Mail className="w-6 h-6 text-green-400" /></div>
                    <div>
                        <p className="font-semibold text-lg">Email</p>
                        <a href="mailto:support@novatrade.ai" className="text-gray-400 hover:text-green-400">support@novatrade.ai</a>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 card-glow">
                    <div className="p-3 bg-green-500/10 rounded-lg"><Phone className="w-6 h-6 text-green-400" /></div>
                    <div>
                        <p className="font-semibold text-lg">Telegram</p>
                        <a href="#" className="text-gray-400 hover:text-green-400">@NovaTradeSupport</a>
                    </div>
                  </div>
                   <div className="bg-gray-900/50 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 card-glow">
                    <div className="p-3 bg-green-500/10 rounded-lg"><MapPin className="w-6 h-6 text-green-400" /></div>
                    <div>
                        <p className="font-semibold text-lg">Address</p>
                        <p className="text-gray-400">123 Future Drive, Tech City, Metaverse</p>
                    </div>
                  </div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
