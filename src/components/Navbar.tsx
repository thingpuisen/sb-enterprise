import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Home, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `text-xs uppercase tracking-widest font-medium transition-colors ${
      isActive ? 'text-black border-b border-black pb-1' : 'text-gray-500 hover:text-black'
    }`;

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 flex-shrink-0 relative flex items-center justify-center bg-white rounded-md overflow-hidden p-1">
               <img 
                 src="/logo.jpg" 
                 alt="SB Enterprise"
                 className="w-full h-full object-contain absolute inset-0 z-10"
                 onError={(e) => {
                   // Fallback to our custom SVG if the logo isn't uploaded yet
                   e.currentTarget.style.display = 'none';
                 }}
               />
               <svg className="w-full h-full text-[#1a1188]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Left Wreath */}
                  <path d="M 33 80 C 10 70 10 40 33 20" stroke="#4a7c36" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 23 72 Q 13 65 20 57 Q 25 65 23 72" fill="#4a7c36" />
                  <path d="M 17 55 Q 8 45 18 35 Q 23 45 17 55" fill="#4a7c36" />
                  <path d="M 22 38 Q 15 25 28 20 Q 30 30 22 38" fill="#4a7c36" />
                  
                  {/* Right Wreath */}
                  <path d="M 67 80 C 90 70 90 40 67 20" stroke="#4a7c36" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M 77 72 Q 87 65 80 57 Q 75 65 77 72" fill="#4a7c36" />
                  <path d="M 83 55 Q 92 45 82 35 Q 77 45 83 55" fill="#4a7c36" />
                  <path d="M 78 38 Q 85 25 72 20 Q 70 30 78 38" fill="#4a7c36" />

                  {/* House Roof */}
                  <path d="M 28 45 L 50 28 L 72 45" stroke="currentColor" strokeWidth="5.5" strokeLinejoin="miter" strokeLinecap="round" />
                  
                  {/* House L-shape */}
                  <path d="M 38 35 L 38 60 L 68 60" stroke="currentColor" strokeWidth="5.5" strokeLinejoin="miter" strokeLinecap="square" />
                  
                  {/* Green Window */}
                  <rect x="47" y="43" width="16" height="14" fill="#589e3d" />
                  <line x1="55" y1="43" x2="55" y2="57" stroke="white" strokeWidth="1.5" />
                  <line x1="47" y1="50" x2="63" y2="50" stroke="white" strokeWidth="1.5" />
                  
                  {/* Text SB */}
                  <text x="50" y="86" fontFamily="Georgia, serif" fontSize="22" fontWeight="900" fill="currentColor" textAnchor="middle" letterSpacing="1">SB</text>
               </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tighter text-black leading-none group-hover:text-gray-700 transition-colors mb-1">SB</h1>
              <span className="text-[9px] tracking-[0.25em] font-bold text-gray-400 uppercase leading-none">Enterprise</span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex gap-4 items-center">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-1 focus:ring-black focus:outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 text-black transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-sm absolute w-full z-50">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <form onSubmit={handleSearch} className="relative mt-2">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black focus:outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </form>
            <div className="flex flex-col gap-4 pt-2 px-2">
              <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Home</NavLink>
              <NavLink to="/products" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Products</NavLink>
              <NavLink to="/contact" onClick={() => setIsMenuOpen(false)} className={navLinkClass}>Contact</NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
