import React from 'react';
import { Camera, Briefcase, Terminal, PlayCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t-4 border-black bg-charcoal pt-16 pb-8 text-white relative overflow-hidden">
      {/* Decorative Neo-Brutalist Background Shape */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span className="text-4xl font-black tracking-widest text-primary uppercase mb-4 block leading-none">
              ENIGMA
            </span>
            <p className="text-gray-300 max-w-md text-lg font-medium border-l-4 border-primary pl-4">
              The official technical club empowering students to learn, build, and innovate. Join us to shape the future of technology.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-xl tracking-wide uppercase border-b-2 border-primary inline-block pb-1">Quick Links</h3>
            <ul className="space-y-3 font-bold">
              <li><Link to="/about" className="hover:text-primary hover:underline uppercase tracking-wide">About Us</Link></li>
              <li><Link to="/events" className="hover:text-primary hover:underline uppercase tracking-wide">Events</Link></li>
              <li><Link to="/team" className="hover:text-primary hover:underline uppercase tracking-wide">Our Team</Link></li>
              <li><Link to="/projects" className="hover:text-primary hover:underline uppercase tracking-wide">Projects</Link></li>
              <li><Link to="/contact" className="hover:text-primary hover:underline uppercase tracking-wide">Contact</Link></li>
              <li><Link to="/admin" className="text-gray-500 hover:text-white uppercase tracking-wide text-sm font-black mt-4 block">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-6 text-xl tracking-wide uppercase border-b-2 border-primary inline-block pb-1">Connect</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              <a href="https://www.instagram.com/enigma_aimt/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border-2 border-black text-black hover:bg-primary neo-btn flex items-center justify-center"><Camera size={20} strokeWidth={2.5} /></a>
              <a href="https://www.linkedin.com/in/enigmaaimt/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border-2 border-black text-black hover:bg-primary neo-btn flex items-center justify-center"><Briefcase size={20} strokeWidth={2.5} /></a>
              <a href="https://x.com/enigma_aimt" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border-2 border-black text-black hover:bg-primary neo-btn flex items-center justify-center"><Terminal size={20} strokeWidth={2.5} /></a>
              <a href="https://www.youtube.com/channel/UCAtnV1qVl-98-OztBtI8oDw" target="_blank" rel="noopener noreferrer" className="p-3 bg-white border-2 border-black text-black hover:bg-primary neo-btn flex items-center justify-center"><PlayCircle size={20} strokeWidth={2.5} /></a>
              <a href="mailto:enigma@ambalika.co.in" className="p-3 bg-white border-2 border-black text-black hover:bg-primary neo-btn flex items-center justify-center"><Mail size={20} strokeWidth={2.5} /></a>
            </div>
            <a href="mailto:enigma@ambalika.co.in" className="text-primary font-bold bg-black inline-block px-3 py-1 border-2 border-primary hover:bg-primary hover:text-black hover:border-black transition-colors">enigma@ambalika.co.in</a>
          </div>
        </div>
        <div className="border-t-2 border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 font-medium">
          <p>&copy; 2026 ENIGMA Technical Club. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
