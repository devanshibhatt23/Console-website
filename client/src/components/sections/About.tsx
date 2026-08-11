import { useState } from 'react';

const TITLE = 'About Us';

export default function About() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black text-white">
      {/* Subtle background radial glow */}
      <div
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: 'rgba(242, 153, 74, 0.06)' }}
      />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end">
          {/* Left Column: Interactive "About Us" giant title */}
          <div className="lg:col-span-7 relative">
            <h2
              className="font-black tracking-tight leading-none select-none flex flex-wrap items-baseline"
              style={{
                fontSize: 'clamp(5.5rem, 10vw, 13rem)',
                fontFamily: "'Menseal', var(--font-display), sans-serif",
              }}
            >
              {TITLE.split('').map((char, index) => {
                if (char === ' ') {
                  return <span key={index} className="inline-block w-[0.25em]">&nbsp;</span>;
                }
                const isHovered = hoveredIndex === index;

                return (
                  <span
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative inline-block cursor-pointer py-4"
                  >
                    <span
                      className="inline-block transition-transform duration-300 ease-out"
                      style={{
                        color: isHovered ? '#f2994a' : '#ffffff',
                        transform: isHovered ? 'translateY(-14px)' : 'translateY(0)',
                        textShadow: isHovered ? '0 0 35px rgba(242, 153, 74, 0.65)' : 'none',
                      }}
                    >
                      {char}
                    </span>

                    {/* Glowing radial aura behind letter */}
                    {isHovered && (
                      <span
                        className="absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10"
                        style={{
                          background: 'radial-gradient(circle, rgba(242, 153, 74, 1) 0%, rgba(240, 64, 92, 0.5) 45%, transparent 75%)',
                          transform: 'scale(2)',
                        }}
                      />
                    )}
                  </span>
                );
              })}
            </h2>
          </div>

          {/* Right Column: Original Description Paragraphs */}
          <div className="lg:col-span-5 space-y-4 text-left font-inter">
            <p className="text-base md:text-lg text-white leading-relaxed font-semibold">
              A tech community to learn and grow, together.
            </p>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              A place where people brainstorm, build and push each other forward.
              We aim at developing skills that actually shape careers, not just DSA, but teamwork,
              problem-solving, networking, and the ability to take an idea from concept to execution.
                          We keep the community up with what's next in tech, and offer mentorship, provide resources
              and a platform to grow alongside your peers.
            </p>
            <p
              className="text-sm md:text-base font-semibold leading-relaxed pt-2"
              style={{ color: '#F2994A' }}
            >
              You think you need any experience to join? You don't! Just show up curious. We will take
              it from there!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
