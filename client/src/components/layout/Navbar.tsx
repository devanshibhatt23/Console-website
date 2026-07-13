import { useState, useEffect, useRef, MouseEvent, FormEvent } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'home', href: '/#hero' },
  { name: 'about', href: '/#about' },
  { name: 'gallery', href: '/#gallery' },
  { name: 'team', href: '/#team' },
  { name: 'events', href: '/events' },
  { name: 'leaderboard', href: '/leaderboard' },
  { name: 'potd', href: '/problem-of-the-day' },
  { name: 'resources', href: '/resources' },
  { name: 'tech guide', href: '/tech-guide' },
];

const SECTION_IDS = ['hero', 'about', 'gallery', 'team', 'previous-events', 'learn-grow'];

const HASH_TO_SECTION: Record<string, string> = {
  '/#hero': 'hero',
  '/#about': 'about',
  '/#gallery': 'gallery',
  '/#team': 'team',
};

// Maps active section ID → nav link href (for non-hash route links)
const SECTION_TO_NAV_HREF: Record<string, string> = {
  'previous-events': '/events',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('hero');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (window.location.pathname !== '/') return;
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.closest('.search-wrapper')?.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/#hero') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
      setMobileMenuOpen(false);
      return;
    }
    if (href.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault();
      const targetId = href.substring(2);
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
    setSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const isActive = (link: { name: string; href: string }) => {
    if (window.location.pathname !== '/') return false;
    // Hash links: check activeSection via map
    const sectionId = HASH_TO_SECTION[link.href];
    if (sectionId) return activeSection === sectionId;
    // Route links: check if activeSection maps to this href
    return SECTION_TO_NAV_HREF[activeSection] === link.href;
  };

  const gradientText = {
    background: 'linear-gradient(90deg, #F2994A, #F0405C)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
  };

  const renderNavItem = (link: { name: string; href: string }, mobile = false) => {
    const active = isActive(link);
    const isHashLink = link.href.startsWith('/#');

    if (mobile) {
      const baseClass = 'text-left font-mono text-muted-foreground hover:text-white text-base py-2 transition-colors';
      return isHashLink ? (
        <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className={baseClass}>
          &gt; {link.name}
        </a>
      ) : (
        <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className={baseClass}>
          &gt; {link.name}
        </Link>
      );
    }

    const sharedActiveContent = (
      <>
        <span style={gradientText}>{link.name}</span>
        <span
          className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
          style={{
            background: 'linear-gradient(90deg, #F2994A, #F0405C)',
            boxShadow: '0 0 8px rgba(242,153,74,0.8)',
          }}
        />
      </>
    );

    if (isHashLink) {
      return (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => handleNavClick(e, link.href)}
          className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
            active ? '' : 'text-muted-foreground hover:scale-[1.02] nav-link-hover'
          }`}
        >
          {active ? sharedActiveContent : <span className="nav-link-text">{link.name}</span>}
        </a>
      );
    }

    return (
      <Link
        key={link.name}
        to={link.href}
        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
          active ? '' : 'text-muted-foreground hover:scale-[1.02] nav-link-hover'
        }`}
      >
        {active ? sharedActiveContent : <span className="nav-link-text">{link.name}</span>}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Logo — </> + CONSOLE */}
        {window.location.pathname === '/' ? (
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            }}
            aria-label="Go to top"
            className="flex items-center gap-2.5 shrink-0 cursor-pointer bg-transparent border-0 outline-none group hover:scale-[1.02] transition-transform duration-200"
          >
            <span className="font-mono font-bold text-lg" style={gradientText}>&lt;/&gt;</span>
            <span className="font-montserrat font-black text-lg tracking-widest hidden sm:block" style={gradientText}>
              CONSOLE
            </span>
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Go to home"
            className="flex items-center gap-2.5 shrink-0 group hover:scale-[1.02] transition-transform duration-200"
          >
            <span className="font-mono font-bold text-lg" style={gradientText}>&lt;/&gt;</span>
            <span className="font-montserrat font-black text-lg tracking-widest hidden sm:block" style={gradientText}>
              CONSOLE
            </span>
          </Link>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks
            .filter((link) => user || link.href !== '/problem-of-the-day')
            .map((link) => renderNavItem(link))}

          {/* Search — only for logged-in users */}
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

          {/* CTA Button */}
          {user ? (
            <Link
              to="/profile"
              className="ml-3 px-5 py-2 rounded-full font-mono text-sm tracking-wider text-white transition-all duration-200 hover:scale-[1.02] flex items-center gap-2 nav-cta-btn"
              style={{
                background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                boxShadow: '0 0 0 1px rgba(242,153,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 12px rgba(242,153,74,0.6), 0 0 0 1px rgba(242,153,74,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 0 1px rgba(242,153,74,0.4)';
              }}
            >
              profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-3 px-5 py-2 rounded-full font-mono text-sm tracking-wider text-white transition-all duration-200 hover:scale-[1.02] nav-cta-btn"
              style={{
                background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                boxShadow: '0 0 0 1px rgba(242,153,74,0.4)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 12px rgba(242,153,74,0.6), 0 0 0 1px rgba(242,153,74,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 0 0 1px rgba(242,153,74,0.4)';
              }}
            >
              login
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
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-muted-foreground hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>
            )}

            {navLinks
              .filter((link) => user || link.href !== '/problem-of-the-day')
              .map((link) => renderNavItem(link, true))}

            {user ? (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-full font-mono text-center mt-3 tracking-wider text-white"
                style={{ background: 'linear-gradient(90deg, #F2994A, #F0405C)' }}
              >
                profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 rounded-full font-mono text-center mt-3 tracking-wider text-white"
                style={{ background: 'linear-gradient(90deg, #F2994A, #F0405C)' }}
              >
                login
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
