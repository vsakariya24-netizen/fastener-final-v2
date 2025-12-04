import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Menu, X, Sparkles, ChevronDown, Package, Settings, ChevronRight } from 'lucide-react';

const { Link, useLocation } = ReactRouterDOM;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'OEM Platform', path: '/oem-platform' },
    { name: 'Manufacturing', path: '/manufacturing' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b font-sans ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-gray-200 py-0' 
          : 'bg-white border-transparent py-0' 
      }`}
    >
      {/* CHANGED: Use 'w-full' instead of 'max-w-...' to push logo to the absolute corner */}
      <div className="w-full px-6 lg:px-10">
      <div className="flex justify-between items-center h-[100px]">
      
      {/* =======================================================
          1. LOGO SECTION (LEFT CORNER)
         ======================================================= */}
      <div className="flex-shrink-0 flex items-center">
        <Link to="/" className="flex items-center gap-4 group">
          
          {/* Yellow Icon - Sized to fit 100px Header */}
          <img 
            src="/durablelogo.png" 
            alt="Logo" 
            // Adjusted to h-[75px] so it fits without breaking the navbar
            className="h-[175px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Divider */}
          <div className="h-12 w-px bg-gray-300 mx-1"></div>

          {/* Classone Text */}
          <img 
            src="/classone.png" 
            alt="Classone" 
            // Adjusted to h-[40px] to align with the icon center
            className="h-[140px] w-auto object-contain mt-1"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </Link>
      </div>

      {/* =======================================================
          2. MENU SECTION (CENTER)
         ======================================================= */}
      <div className="hidden lg:flex flex-1 justify-center items-center space-x-1">
        
        <Link to="/" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>
          Home
        </Link>

        {/* Products Dropdown */}
        <div className="relative group px-1">
          <button className={`whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/products') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 group-hover:text-black group-hover:bg-gray-50'}`}>
            Products <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
          
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-6 overflow-hidden">
             <div className="grid grid-cols-2 gap-6">
                <Link to="/products?category=fasteners" className="group/item block p-4 rounded-xl hover:bg-blue-50 transition-colors">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><Settings size={20} /></div>
                      <div><h4 className="font-bold text-gray-900">Fasteners</h4><p className="text-xs text-gray-500 mt-1">Screws & Anchors.</p></div>
                   </div>
                </Link>
                <Link to="/products?category=fittings" className="group/item block p-4 rounded-xl hover:bg-orange-50 transition-colors">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0"><Package size={20} /></div>
                      <div><h4 className="font-bold text-gray-900">Fittings</h4><p className="text-xs text-gray-500 mt-1">Hinges & Magnets.</p></div>
                   </div>
                </Link>
             </div>
          </div>
        </div>

        <Link to="/oem-platform" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/oem-platform') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>OEM Platform</Link>
        <Link to="/manufacturing" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/manufacturing') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>Manufacturing</Link>
        <Link to="/about" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/about') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>About Us</Link>
        <Link to="/blog" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/blog') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>Blog</Link>
        <Link to="/careers" className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/careers') ? 'bg-gray-100 text-blue-700' : 'text-gray-600 hover:text-black hover:bg-gray-50'}`}>Careers</Link>
      </div>

      {/* =======================================================
          3. RIGHT ACTIONS
         ======================================================= */}
      <div className="flex items-center space-x-3 flex-shrink-0">
         <Link to="/ai-finder" className="hidden xl:flex items-center gap-2 bg-[#1a1a2e] text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-all shadow-md whitespace-nowrap">
           <Sparkles size={14} className="text-yellow-400" /> AI Finder
         </Link>
         <Link to="/contact" className="hidden md:inline-block bg-[#fbbf24] text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-md whitespace-nowrap">
           Get Quote
         </Link>
         
         {/* Mobile Toggle */}
         <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

    </div>
  </div>

  {/* Mobile Menu */}
  <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
    <div className="bg-white border-t border-gray-100 shadow-xl px-4 pt-4 pb-6 space-y-2">
        <Link to="/products" className="block px-4 py-3 rounded-lg text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-black">Products</Link>
        {navLinks.map((link) => (
          <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-black">{link.name}</Link>
        ))}
    </div>
  </div>
</nav>
);
}

export default Navbar;
