import React from "react";
import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const menuLinks = [
    { name: "Explore Frequencee", href: "/" },
    { name: "Trading Bot", href: "/trading-bot" },
    { name: "VPS Servers", href: "/vps-servers" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  const XIcon = () => (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <footer className="relative bg-[#212525] text-white rounded-2xl border border-[#637260] max-w-[90%] mx-auto mt-10 lg:mt-20 mb-10">
      {/* Main Footer Content */}
      <div className="flex flex-col lg:flex-row justify-between px-6 sm:px-10 lg:px-12 py-12 lg:py-14 gap-6 border-b border-[#637260]">
        {/* Left Section */}
        <div className="space-y-6 max-w-xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-green-400">
              <svg
                className="w-9 h-9"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-light">NovaTrade AI</span>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <p className="text-[#8c9b94] text-sm sm:text-base">
              Not Just Smarter. Superior.
            </p>
            <h3 className="text-3xl sm:text-4xl lg:text-3xl font-light leading-tight">
              Where{" "}
              <span className="text-[#80ee64]">AI Flexes Harder</span>
              <br />
              Than Wall Street
            </h3>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-between w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-[#637260] lg:pl-12 pt-8 lg:pt-0">
          {/* Menu */}
          <div>
            
            <nav className="space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-[#707c75] hover:text-[#80ee64] transition-colors duration-300 text-sm sm:text-base"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-8 lg:mt-12">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[#5a645f] hover:border-[#80ee64] hover:text-[#80ee64] transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
            {/* X (Twitter) */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#5a645f] hover:border-[#80ee64] hover:text-[#80ee64] transition-all duration-300"
            >
              <XIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row justify-center items-center text-[#707c75] text-sm px-6 sm:px-10 lg:px-12 py-4">
        <p>© {new Date().getFullYear()} NovaTrade AI</p>
       
      </div>
    </footer>
  );
};

export default Footer;
