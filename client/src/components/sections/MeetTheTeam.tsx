import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Github, Linkedin, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: 'Arjun Sharma',
    role: 'President',
    avatar: 'AS',
    avatarBg: 'bg-primary/20 border-primary/30',
    hoverBorder: 'hover:border-primary/40',
    gradientFrom: 'from-primary/20',
    quote: 'Code is poetry that compiles.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Priya Nair',
    role: 'Vice President',
    avatar: 'PN',
    avatarBg: 'bg-secondary/20 border-secondary/30',
    hoverBorder: 'hover:border-secondary/40',
    gradientFrom: 'from-secondary/20',
    quote: 'Build things that outlast the semester.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Rahul Mehta',
    role: 'Technical Lead',
    avatar: 'RM',
    avatarBg: 'bg-accent/20 border-accent/30',
    hoverBorder: 'hover:border-accent/40',
    gradientFrom: 'from-accent/20',
    quote: 'Ship fast, break things, fix faster.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Sneha Patel',
    role: 'CP Lead',
    avatar: 'SP',
    avatarBg: 'bg-yellow-500/20 border-yellow-500/30',
    hoverBorder: 'hover:border-yellow-500/30',
    gradientFrom: 'from-yellow-500/15',
    quote: 'Rate is just a number. Thinking is the skill.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Akhil Reddy',
    role: 'Design Lead',
    avatar: 'AR',
    avatarBg: 'bg-pink-500/20 border-pink-500/30',
    hoverBorder: 'hover:border-pink-500/30',
    gradientFrom: 'from-pink-500/15',
    quote: 'Pixels and prototypes — in that order.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Meera Joshi',
    role: 'Community Manager',
    avatar: 'MJ',
    avatarBg: 'bg-green-500/20 border-green-500/30',
    hoverBorder: 'hover:border-green-500/30',
    gradientFrom: 'from-green-500/15',
    quote: 'Every great dev team starts with people.',
    github: '#',
    linkedin: '#',
    twitter: '#',
  },
];

export default function MeetTheTeam() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="team" ref={sectionRef} className="py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-primary mb-6">
            <span className="w-2 h-2 rounded-full bg-primary" />
            The Core Team
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Meet the <span className="text-gradient-fire">People</span>
          </h2>
          <p className="text-muted-foreground font-mono leading-relaxed">
            Driven by caffeine and curiosity. These are the humans who keep Console running.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}>
              <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.08} className="h-full">
                <div className={`relative h-full p-7 rounded-2xl bg-card border border-white/5 ${member.hoverBorder} transition-all duration-500 overflow-hidden group cursor-default`}>
                  {/* Gradient bg reveal */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${member.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 font-mono font-bold text-xl text-white group-hover:scale-105 transition-transform duration-300 ${member.avatarBg}`}>
                      {member.avatar}
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                      <span className="font-mono text-xs text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                        {member.role}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm font-mono italic leading-relaxed mb-6">
                      "{member.quote}"
                    </p>

                    {/* Social links */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {[
                        { href: member.github, Icon: Github, label: 'GitHub' },
                        { href: member.linkedin, Icon: Linkedin, label: 'LinkedIn' },
                        { href: member.twitter, Icon: Twitter, label: 'Twitter' },
                      ].map(({ href, Icon, label }) => (
                        <a
                          key={label}
                          href={href}
                          aria-label={label}
                          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-white/40"
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
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
