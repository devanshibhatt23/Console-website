import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useEffect, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';

import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import Events from "./pages/Events";
import ProfileView from "./pages/ProfileView";
import SearchUsers from "./pages/SearchUsers";
import ProtectedRoute from "./components/ProtectedRoute";

import Loader from '@/components/layout/Loader';

const queryClient = new QueryClient();

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');

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

    return () => {
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
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/events" element={<Events />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/problem-of-the-day" element={<POTD />} />
                    <Route path="/potd-leaderboard" element={<POTDLeaderboard />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/resources/:domain" element={<ResourceDomain />} />
                    <Route path="/tech-guide" element={<TechGuide />} />
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
