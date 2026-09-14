import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Compass, Sparkles, Layers, History, CheckCircle, Menu, X, BookOpen } from 'lucide-react';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* Search Trigger & Mobile Hamburger */}
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
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export const Footer: React.FC = () => {
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
        <div>
          <span>&copy; {new Date().getFullYear()} Math Frontier. All mathematical citations peer-verified.</span>
          <div className="mt-1 text-slate-400">
            Created by <strong className="text-cyan-400 font-medium">Shatrughna Ambhore</strong> • <a href="mailto:ambhoreshatrughna@gmail.com" className="text-cyan-400 hover:underline">ambhoreshatrughna@gmail.com</a> • <a href="tel:+919604466334" className="text-cyan-400 hover:underline">+91 9604466334</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
