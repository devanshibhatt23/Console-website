import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

    </div>
  );
}
