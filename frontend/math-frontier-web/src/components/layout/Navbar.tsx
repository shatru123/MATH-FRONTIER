import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, Sparkles, Layers, History, CheckCircle, Menu, X, BookOpen } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { CreatorProfileModal } from './CreatorProfileModal';

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  // Global event listener to open/close creator profile from anywhere
  useEffect(() => {
    const openHandler = () => setIsProfileOpen(true);
    const closeHandler = () => setIsProfileOpen(false);
    window.addEventListener('mathfrontier:open-profile', openHandler);
    window.addEventListener('mathfrontier:close-profile', closeHandler);
    return () => {
      window.removeEventListener('mathfrontier:open-profile', openHandler);
      window.removeEventListener('mathfrontier:close-profile', closeHandler);
    };
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Problems', path: '/problems', icon: BookOpen },
    { name: 'Wonders', path: '/wonders', icon: Sparkles },
    { name: '3D Gallery', path: '/gallery', icon: Layers },
    { name: 'Lab', path: '/lab', icon: Compass },
    { name: 'Solved', path: '/solved', icon: CheckCircle },
    { name: 'Timeline', path: '/timeline', icon: History }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-base shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              ∰
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-base sm:text-lg font-black tracking-wider text-slate-100 group-hover:text-cyan-400 transition-colors">
                MATH FRONTIER
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                Digital Museum & Lab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search Trigger, Creator Avatar & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Search mathematical knowledge...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-950 border border-slate-700 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Creator Profile Button */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition group shrink-0"
              title="Shatrughna Ambhore — Platform Creator"
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-60 group-hover:opacity-100 blur-[2px] transition"></div>
                <img
                  src="/images/shatrughna.jpg"
                  alt="Shatrughna Ambhore"
                  className="relative w-6 h-6 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-cyan-400 transition"
                />
              </div>
              <span className="hidden lg:inline text-[11px] font-medium text-slate-300 group-hover:text-cyan-400">Creator</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Mobile Creator Profile Link */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900 w-full text-left"
            >
              <img
                src="/images/shatrughna.jpg"
                alt="Shatrughna Ambhore"
                className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
              <span>Creator Profile (Shatrughna Ambhore)</span>
            </button>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Creator Profile Photo & Details Modal */}
      <CreatorProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export const Footer: React.FC = () => {
  const handleOpenProfile = () => {
    if (typeof (window as any).openProfileModal === 'function') {
      (window as any).openProfileModal();
    } else {
      window.dispatchEvent(new CustomEvent('mathfrontier:open-profile'));
    }
  };

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-12 relative z-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-md space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold text-lg font-cinzel">MATH FRONTIER</span>
          </div>
          <p className="text-slate-400 italic">
            "Some questions have answers. Some have proofs. Some have neither."
          </p>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            A digital mathematics museum and interactive laboratory exploring famous open problems, topological wonders, paradoxical phenomena, and the boundary of human knowledge.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 font-mono text-[11px]">
          <div>
            <span className="text-slate-200 font-bold uppercase tracking-wider block mb-2">Exhibits</span>
            <ul className="space-y-1.5">
              <li><Link to="/problems" className="hover:text-cyan-400">Open Catalog</Link></li>
              <li><Link to="/wonders" className="hover:text-cyan-400">Topology Wonders</Link></li>
              <li><Link to="/gallery" className="hover:text-cyan-400">3D Interactive Objects</Link></li>
              <li><Link to="/solved" className="hover:text-cyan-400">Solved Breakthroughs</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-slate-200 font-bold uppercase tracking-wider block mb-2">Laboratories</span>
            <ul className="space-y-1.5">
              <li><Link to="/wonders/mobius-strip" className="hover:text-cyan-400">Möbius Strip 3D</Link></li>
              <li><Link to="/lab?tool=fractals" className="hover:text-cyan-400">Fractal Lab</Link></li>
              <li><Link to="/lab?tool=collatz" className="hover:text-cyan-400">Collatz Trajectory</Link></li>
              <li><Link to="/wonders/hilberts-hotel" className="hover:text-cyan-400">Hilbert's Hotel</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-slate-200 font-bold uppercase tracking-wider block mb-2">Architecture</span>
            <ul className="space-y-1.5">
              <li><span className="text-slate-400">Backend: .NET 10 API</span></li>
              <li><span className="text-slate-400">Frontend: React + Three.js</span></li>
              <li><a href="/health" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">System Health Status</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenProfile}
            className="focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full group cursor-pointer transition transform hover:scale-110 active:scale-95 shrink-0"
            title="Click to view full profile photo"
          >
            <img
              src="/images/shatrughna.jpg"
              alt="Shatrughna Ambhore"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-blue-500 shadow transition"
            />
          </button>
          <div>
            <span>&copy; {new Date().getFullYear()} Math Frontier. All mathematical citations peer-verified.</span>
            <div className="mt-1 text-slate-400">
              Created by{' '}
              <button
                type="button"
                onClick={handleOpenProfile}
                className="text-slate-100 font-semibold hover:text-cyan-400 underline decoration-slate-600 hover:decoration-cyan-400 transition cursor-pointer"
              >
                Shatrughna Ambhore
              </button>{' '}
              •{' '}
              <a href="mailto:ambhoreshatrughna@gmail.com" className="text-cyan-400 hover:underline">
                ambhoreshatrughna@gmail.com
              </a>{' '}
              •{' '}
              <a href="tel:+919604466334" className="text-cyan-400 hover:underline">
                +91 9604466334
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
