import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, BookOpen, Trophy } from 'lucide-react';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: 'Build',
    icon: Code2,
    description: 'From web apps to machine learning models, we believe the best way to learn is by building real things.'
  },
  {
    title: 'Learn',
    icon: BookOpen,
    description: 'Workshops, study jams, and peer-to-peer mentoring. We break down complex concepts and grow our technical stack together.'
  },
  {
    title: 'Compete',
    icon: Trophy,
    description: 'Hackathons, contests, and competitions - We show up prepared to compete against the best and rise up stronger than before.'
  },
];

const domains = [
  'Web Development', 'App Development', 'Competitive Programming', 
  'Machine Learning', 'UI/UX Design', 'Cyber Security'
];

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text content
      gsap.fromTo(
        textRef.current?.children || [],
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: textRef.current, start: 'top 80%' },
        }
      );

      // Stagger in pillars
      gsap.fromTo(
        pillarsRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%' },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-page-container" ref={containerRef}>
      {/* Background Image Layer */}
      <div className="about-bg-layer" />
      <div className="about-overlay" />

      {/* Main Layout Grid */}
      <main className="about-main-content">
        
        {/* Left Column: Vertical Title */}
        <div className="about-vertical-title">
          <span>A</span>
          <span>B</span>
          <span>O</span>
          <span>U</span>
          <span>T</span>
        </div>

        {/* Right Column: Content */}
        <div className="about-text-content" ref={textRef}>
          <h1 className="about-intro">A tech community to learn and grow, together.</h1>
          
          <p className="about-paragraph">
            A place where people brainstorm, build and push each other forward.
          </p>
          
          <p className="about-paragraph">
            We aim at developing skills that actually shape careers — not just DSA, but teamwork,
            problem-solving, networking, and the ability to take an idea from concept to execution.
          </p>
          
          <p className="about-paragraph">
            We keep the community up with what's next in tech, and offer mentorship, provide resources
            and a platform to grow alongside your peers.
          </p>

          <div className="about-highlight">
            You think you need any experience to join? You don't! Just show up curious — We will take it from there!
          </div>
        </div>
      </main>

      {/* Infinite Marquee Strip */}
      <div className="about-marquee-wrapper">
        <div className="about-marquee-track">
          {/* Duplicate domains array for infinite loop effect */}
          {[...domains, ...domains, ...domains].map((domain, index) => (
            <div key={index} className="about-marquee-item">
              {domain}
            </div>
          ))}
        </div>
      </div>

      {/* Pillars Section */}
      <section className="about-pillars" ref={pillarsRef}>
        {pillars.map((pillar, idx) => (
          <div key={idx} className="about-pillar-card">
            <div className="about-pillar-icon">
              <pillar.icon size={28} />
            </div>
            <h3 className="about-pillar-title">{pillar.title}</h3>
            <p className="about-pillar-desc">{pillar.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
