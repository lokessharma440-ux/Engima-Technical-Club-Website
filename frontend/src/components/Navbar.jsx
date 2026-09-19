import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoUrl from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Projects', path: '/projects' },
    { name: 'Join Us', path: '/join-us' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b-2 border-charcoal ${isScrolled ? 'bg-background py-2 neo-shadow' : 'bg-background py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="h-16 md:h-20 w-auto flex items-center justify-center -ml-2">
              <img src={logoUrl} alt="ENIGMA Logo" className="h-full w-auto object-contain" />
            </div>
            <div className="ml-4 hidden lg:flex flex-col">
              <span className="text-3xl font-bold tracking-tight text-charcoal leading-none uppercase">
                Enigma
              </span>
              <span className="text-xs text-charcoal font-bold tracking-[0.2em] uppercase mt-1">
                Technical Club
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base font-bold tracking-wide transition-all uppercase px-2 py-1 ${
                  location.pathname === link.path ? 'bg-primary text-charcoal border-2 border-charcoal neo-shadow-sm' : 'text-charcoal hover:bg-charcoal hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/events" className="px-5 py-2 bg-primary border-2 border-charcoal text-charcoal font-bold uppercase tracking-wider hover:-translate-y-1 neo-btn">
              Upcoming Events
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-charcoal hover:bg-primary border-2 border-transparent hover:border-charcoal p-1 transition-all">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background absolute top-full left-0 w-full border-b-2 border-charcoal neo-shadow">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg font-bold uppercase p-3 border-2 border-transparent ${
                  location.pathname === link.path ? 'bg-primary border-charcoal neo-shadow-sm text-charcoal' : 'text-charcoal hover:border-charcoal'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
