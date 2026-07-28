import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import POTD from '@/components/sections/POTD';
import UpcomingEvents from '@/components/sections/UpcomingEvents';
import About from '@/components/sections/About';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const GALLERY_ROW1 = [
  "/images/IMG_0051.jpg",
  "/images/IMG_0207.jpg",
  "/images/IMG_1594.JPG",
  "/images/IMG_2003.jpg",
  "/images/IMG_20260117_134333116_HDR.jpg",
  "/images/IMG_2055.jpg",
  "/images/IMG_4105.jpg",
  "/images/IMG_4412.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.34.04.jpeg"
];

const GALLERY_ROW2 = [
  "/images/IMG_0079.jpg",
  "/images/IMG_1590.jpg",
  "/images/IMG_1599.jpg",
  "/images/IMG_2011.jpg",
  "/images/IMG_20260117_151044965_HDR.jpg",
  "/images/IMG_2065.jpg",
  "/images/IMG_4394.jpg",
  "/images/WhatsApp Image 2026-04-14 at 13.36.52.jpeg",
  "/images/WhatsApp Image 2026-04-14 at 15.39.56.jpeg"
];

const FAQ_ITEMS = [
  {
    question: "Who can join Console?",
    answer:
      "Any student at MNIT Jaipur can join Console! We welcome students from all departments and years, from first-year freshers to final-year seniors. All you need is curiosity and a willingness to learn.",
  },
  {
    question: "Do I need prior coding experience to join?",
    answer:
      "Absolutely not. You just need to show up curious. We have resources, mentorship, and a supportive community to help you start from scratch and grow at your own pace.",
  },
  {
    question: "What kind of events does Console organize?",
    answer:
      "We organize hackathons, coding contests, technical workshops, peer study sessions, and collaborative projects. Our events range from beginner-friendly sessions to competitive programming challenges, there's something for everyone.",
  },
  {
    question: "How do I stay updated about events and announcements?",
    answer:
      "Follow us on LinkedIn and Instagram for real-time updates. You can also create a profile on this platform to access all upcoming events, the leaderboard, and Problem of the Day challenges.",
  },
  {
    question: "Is there a membership fee?",
    answer:
      "No! Console is free to join. We believe in open access to knowledge, community, and opportunity. Just sign up and you're part of the community.",
  },
  {
    question: "How can I contribute or take on a more active role?",
    answer:
      "Attend our events, be active on the platform, and reach out to us on social media. We're always looking for enthusiastic members to help organize initiatives, mentor peers, and lead projects.",
  },
];

export default function Landing() {
  const { user } = useAuth();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      const el = document.getElementById(targetId);
      if (el) {
        // Small delay to ensure rendering is complete
        setTimeout(() => {
          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: -100, immediate: true });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    document.body.classList.add('is-landing');
    return () => {
      document.body.classList.remove('is-landing');
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const x = e.clientX;
    const y = e.clientY;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      containerRef.current?.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current?.style.setProperty('--mouse-y', `${y}px`);
      rafRef.current = null;
    });
  }

  return (
    <div
      ref={containerRef}
      className="bg-black min-h-screen text-foreground overflow-hidden selection:bg-primary/30 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight cursor effect — sits above content, below navbar */}
      <div className="landing-spotlight" aria-hidden="true" />

      <Navbar />

      <main>
        {/* Hero */}
        <Hero />

        {/* About */}
        <About />

        {/* Home page additions — visible only when logged in */}
        {user && (
          <>
            <POTD />
            <UpcomingEvents />
          </>
        )}

        {/* Gallery */}
        <section id="gallery" className="landing-section gallery-section pt-8 pb-6 bg-black">
          <div className="gallery-header text-center mb-10">
            <h2
              className="section-title text-5xl md:text-6xl font-black font-montserrat mb-4"
              style={{
                background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'default',
                display: 'inline-block',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1.02)';
                el.style.filter = 'drop-shadow(0 0 16px rgba(242,153,74,0.65)) drop-shadow(0 0 32px rgba(240,64,92,0.35))';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = '';
                el.style.filter = '';
              }}
            >
              Life at CONSOLE
            </h2>
            <p className="section-subtitle text-gray-400 font-inter">
              Moments from our coding sessions, hackathons, and meetups
            </p>
          </div>
          <div className="infinite-scroller-container relative overflow-hidden">
            <div className="scroll-row left-to-right">
              <div className="scroll-track">
                {GALLERY_ROW1.concat(GALLERY_ROW1).map((src, i) => (
                  <div className="gallery-item-wrapper" key={`g1-${i}`}>
                    <img src={src} alt="Console Moment" className="gallery-img object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
            <div className="scroll-row right-to-left mt-6">
              <div className="scroll-track">
                {GALLERY_ROW2.concat(GALLERY_ROW2).map((src, i) => (
                  <div className="gallery-item-wrapper" key={`g2-${i}`}>
                    <img src={src} alt="Console Moment" className="gallery-img object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="pt-8 pb-16 bg-black relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none blur-[120px]"
            style={{ background: 'rgba(242,153,74,0.06)' }}
          />
          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <div className="text-center mb-14" style={{ marginTop: user ? '120px' : '80px' }}>
              <h2 className="section-gradient-title text-4xl md:text-5xl tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground font-inter mb-4">
                Everything you want to know about Console.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border border-white/10 rounded-xl px-6 bg-white/[0.02] transition-all duration-300"
                  style={{ borderRadius: '0.75rem' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(242,153,74,0.4)';
                    el.style.boxShadow = '0 0 24px rgba(242,153,74,0.18), 0 0 48px rgba(242,153,74,0.07)';
                    el.style.transform = 'scale(1.02)';
                    el.style.background = 'rgba(242,153,74,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.boxShadow = 'none';
                    el.style.transform = 'scale(1)';
                    el.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <AccordionTrigger
                    className="text-left font-montserrat font-semibold text-white hover:no-underline py-5 text-base"
                    style={{ color: '#fff' }}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-inter leading-relaxed pb-5 text-sm">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
