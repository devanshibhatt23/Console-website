import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'About', href: '/#about' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Team', href: '/#team' },
  { name: 'Events', href: '/events' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'POTD', href: '/problem-of-the-day' },
  { name: 'Resources', href: '/resources' },
  { name: 'Tech Guide', href: '/tech-guide' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus input when search bar opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.closest('.search-wrapper')?.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault();
      const targetId = href.substring(2);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      window.history.pushState(null, '', href);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileMenuOpen(false);
    } else {
      navigate('/search');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/75 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        {window.location.pathname === '/' ? (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            }}
            aria-label="Go to top"
            className="flex items-center gap-3 shrink-0 cursor-pointer text-white bg-transparent border-0 outline-none"
          >
            <div className="w-9 h-9 rounded flex items-center justify-center overflow-hidden">
              <img
                src="/console-logo.png"
                alt="Console Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-primary/20', 'border', 'border-primary/50');
                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>';
                  }
                }}
              />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight hidden sm:block">
              CONSOLE<span className="text-primary animate-pulse">_</span>
            </span>
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center gap-3 shrink-0 text-white"
          >
            <div className="w-9 h-9 rounded flex items-center justify-center overflow-hidden">
              <img
                src="/console-logo.png"
                alt="Console Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.classList.add('bg-primary/20', 'border', 'border-primary/50');
                    parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>';
                  }
                }}
              />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight hidden sm:block">
              CONSOLE<span className="text-primary animate-pulse">_</span>
            </span>
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks
            .filter((link) => user || link.name !== 'POTD')
            .map((link) => (
              link.href.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-mono text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 text-sm font-mono text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}

          {/* Search bar — only for logged-in users */}
          {user && (
            <div className="search-wrapper relative flex items-center ml-1">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.form
                    key="search-form"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearchSubmit}
                    className="flex items-center overflow-hidden"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 w-full">
                      <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search members..."
                        className="bg-transparent text-sm font-mono text-white placeholder:text-muted-foreground outline-none w-full"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-muted-foreground hover:text-white shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.form>
                ) : (
                  <motion.button
                    key="search-icon"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    aria-label="Search members"
                    className="p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA */}
          {user ? (
            <Link
              to="/profile"
              className="ml-3 border-gradient-fire px-5 py-2 rounded font-mono text-sm uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-3 border-gradient-fire px-5 py-2 rounded font-mono text-sm uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2 cursor-pointer bg-transparent border-0 outline-none"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="absolute top-full left-0 right-0 bg-black/98 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-2"
          >
            {/* Mobile Search — only for logged-in users */}
            {user && (
              <form onSubmit={handleSearchSubmit} className="mb-2">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/8 border border-white/10">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search members..."
                    className="bg-transparent text-sm font-mono text-white placeholder:text-muted-foreground outline-none w-full"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>
            )}

            {navLinks
              .filter((link) => user || link.name !== 'POTD')
              .map((link) => (
                link.href.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-left font-mono text-muted-foreground hover:text-white text-base py-2"
                  >
                    &gt; {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-left font-mono text-muted-foreground hover:text-white text-base py-2"
                  >
                    &gt; {link.name}
                  </Link>
                )
              ))}

            {user ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="border-gradient-fire px-6 py-3 rounded font-mono text-center mt-3 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="border-gradient-fire px-6 py-3 rounded font-mono text-center mt-3 uppercase tracking-wider"
              >
                Login
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

