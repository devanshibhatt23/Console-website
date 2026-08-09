import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Code2, BookOpen, Trophy } from 'lucide-react';

const pillars = [
  {
    title: 'Build',
    icon: Code2,
    description:
      'From web apps to machine learning models, we believe the best way to learn is by building real things.',
    hoverBg: 'rgba(255, 175, 80, 0.22)',
    borderHover: 'rgba(242,153,74,0.5)',
  },
  {
    title: 'Learn',
    icon: BookOpen,
    description:
      'Workshops, study jams, and peer-to-peer mentoring. We break down complex concepts and grow our technical stack together.',
    hoverBg: 'rgba(99, 179, 237, 0.18)',
    borderHover: 'rgba(99,179,237,0.5)',
  },
  {
    title: 'Compete',
    icon: Trophy,
    description:
      'Hackathons, contests, and competitions - We show up prepared to compete against the best and rise up stronger than before.',
    hoverBg: 'rgba(104, 211, 145, 0.18)',
    borderHover: 'rgba(104,211,145,0.5)',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        }
      );
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="pt-33 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 -right-[20%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'rgba(242,153,74,0.08)' }}
      />

      <div className="container mx-auto px-6">
        {/* About heading + text — centered */}
        <div ref={headerRef} className="max-w-3xl mx-auto text-center mb-20">
          <div className="code-section-tag">// ABOUT.CONSOLE</div>
          <h2 className="section-gradient-title text-4xl md:text-5xl tracking-tight mb-10">
            About Us
          </h2>

          <div className="space-y-5 text-center">
            <p className="text-lg md:text-xl text-white font-inter leading-relaxed font-medium">
              A tech community to learn and grow, together.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-inter leading-relaxed">
              A place where people brainstorm, build and push each other forward.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-inter leading-relaxed">
              We aim at developing skills that actually shape careers, not just DSA, but teamwork,
              problem-solving, networking, and the ability to take an idea from concept to execution.
            </p>
            <p className="text-base md:text-lg text-muted-foreground font-inter leading-relaxed">
              We keep the community up with what's next in tech, and offer mentorship, provide resources
              and a platform to grow alongside your peers.
            </p>
            <p
              className="text-base md:text-lg font-inter font-semibold leading-relaxed"
              style={{ color: '#F2994A' }}
            >
              You think you need any experience to join? You don't! Just show up curious. We will take
              it from there!
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} ref={(el) => { cardsRef.current[index] = el; }}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="all"
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                className="h-full"
              >
                <div
                  className="h-full p-8 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-500 relative overflow-hidden group cursor-default"
                  style={{ background: 'rgba(12, 16, 26, 0.7)' }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = pillar.borderHover;
                    el.style.background = pillar.hoverBg;
                    el.style.boxShadow = `0 10px 40px ${pillar.hoverBg}, 0 0 60px ${pillar.hoverBg}`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                    el.style.background = 'rgba(12, 16, 26, 0.7)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Large background number label */}
                  <span className="absolute top-3 right-5 font-mono font-black text-6xl text-white/[0.04] group-hover:text-white/[0.08] transition-colors pointer-events-none select-none">
                    0{index + 1}
                  </span>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500">
                      <pillar.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3
                      className="text-2xl font-bold mb-4 font-montserrat"
                      style={{
                        background: 'linear-gradient(90deg, #F2994A, #F0405C)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-inter">
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
