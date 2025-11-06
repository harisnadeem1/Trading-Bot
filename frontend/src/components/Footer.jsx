
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Investment Plans', href: '/#investment-plans' },
  { name: 'Affiliate', href: '/#affiliate-program' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '#' },
];

const Footer = () => {
    const scrollToSection = (e, href) => {
        if (href.startsWith('/#')) {
        e.preventDefault();
        const sectionId = href.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = href;
        }
        } else if (href === '/'){
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

  return (
    <footer id="footer" className="bg-black border-t border-green-500/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold">NovaTrade AI</div>
              <div className="text-sm text-gray-500">Where AI Flexes Harder Than Wall Street</div>
            </div>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm"
              >
                {link.name}
              </Link>
            ))}
          </motion.nav>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-green-500/10 text-center text-sm text-gray-500"
        >
          <p>&copy; {new Date().getFullYear()} NovaTrade AI. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
