import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Code2, BookOpen, Trophy } from 'lucide-react';

const pillars = [
  {
    title: 'Build',
    icon: Code2,
    description: 'We turn caffeine into code. From web apps to machine learning models, we believe the best way to learn is by building real things.',
    color: 'from-primary/20 to-transparent',
    borderColor: 'border-primary/50'
  },
  {
    title: 'Learn',
    icon: BookOpen,
    description: 'Workshops, study jams, and peer-to-peer mentoring. We demystify complex concepts and grow our technical stack together.',
    color: 'from-secondary/20 to-transparent',
    borderColor: 'border-secondary/50'
  },
  {
    title: 'Compete',
    icon: Trophy,
    description: 'Hackathons, CTFs, and competitive programming. We test our skills against the best and bring home the hardware.',
    color: 'from-accent/20 to-transparent',
    borderColor: 'border-accent/50'
  }
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      );

      // Cards stagger animation
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 -right-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Who We Are
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight md:leading-snug">
            Not just a club. <br />
            <span className="text-gradient-fire">A collective.</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-mono leading-relaxed">
            Console is the nexus for developers who don't just want to pass classes, but want to push boundaries. We are the terminal where ideas compile into reality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} ref={el => { cardsRef.current[index] = el; }}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="all"
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                className="h-full"
              >
                <div className={`h-full p-8 rounded-xl bg-card border border-white/5 hover:${pillar.borderColor} transition-colors duration-500 relative overflow-hidden group`}>
                  {/* Subtle gradient background that reveals on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                      <pillar.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-mono">{pillar.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
