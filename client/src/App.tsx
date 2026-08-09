import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState, useCallback, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import POTDLeaderboard from "./pages/POTDLeaderboard";
import POTD from "./pages/POTD";
import Resources from "./pages/Resources";
import ResourceDomain from "./pages/ResourceDomain";
import TechGuide from "./pages/TechGuide";
import PlacementPlaybook from "./pages/PlacementPlaybook";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import AboutPage from "./pages/AboutPage";
import Events from "./pages/Events";
import MeetTheTeam from "./pages/MeetTheTeam";
import ProfileView from "./pages/ProfileView";
import SearchUsers from "./pages/SearchUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

import Loader from '@/components/layout/Loader';

const queryClient = new QueryClient();

gsap.registerPlugin(ScrollTrigger);

// Resets scroll position to the top whenever the route changes, so
// navigating to a new page never inherits the previous page's scroll
// offset (e.g. clicking a link from a scrolled-down section on the
// homepage no longer lands mid-page on the destination route).
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't override scroll if navigating to a hash section
    if (window.location.hash) return;
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #F2994A, #F0405C)',
        zIndex: 9999,
        transition: 'width 0.1s linear',
        boxShadow: '0 0 8px rgba(242,153,74,0.6)',
        pointerEvents: 'none',
      }}
    />
  );
}

function App() {
  const [loading, setLoading] = useState(() => window.location.pathname === '/');

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initialize theme from localStorage (default: dark)
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Drive Lenis exclusively from GSAP ticker (NOT a separate rAF loop)
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0, 0);

    // Expose the Lenis instance so route-change scroll resets can use it
    // instead of fighting its smooth-scroll state with a raw window.scrollTo.
    (window as any).__lenis = lenis;

    return () => {
      (window as any).__lenis = null;
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Loader — always mounted first, unmounts after exit animation */}
        {loading && <Loader onComplete={handleLoaderComplete} />}

        {/* Site fades in once loading is done */}
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="min-h-screen"
            >
              <BrowserRouter>
                <ScrollProgressBar />
                <ScrollToTop />
                <Navbar />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/team" element={<MeetTheTeam />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/:domain" element={<ResourceDomain />} />
                  <Route path="/tech-guide" element={<TechGuide />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/problem-of-the-day" element={<POTD />} />
                    <Route path="/potd-leaderboard" element={<POTDLeaderboard />} />
                    <Route path="/placement-playbook" element={<PlacementPlaybook />} />
                    <Route path="/profile/:userId" element={<ProfileView />} />
                    <Route path="/search" element={<SearchUsers />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin/*" element={<Admin />} />
                  </Route>

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
