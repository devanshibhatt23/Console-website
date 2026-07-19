import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Briefcase, Code2, Network, MessageSquare, ArrowRight, Star, Building2 } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Code2,
    title: 'DSA Mastery',
    description: 'Arrays → Graphs → DP. The systematic path to solving any interview problem in under 30 minutes.',
    accent: 'text-primary',
    iconBg: 'bg-primary/10',
    hoverBorder: 'hover:border-primary/30',
    tags: ['150 LeetCode Patterns', 'Striver SDE Sheet', 'NeetCode 150'],
  },
  {
    icon: Network,
    title: 'System Design',
    description: 'Design Netflix, WhatsApp, Uber. Scale to millions. Make HLD/LLD second nature.',
    accent: 'text-secondary',
    iconBg: 'bg-secondary/10',
    hoverBorder: 'hover:border-secondary/30',
    tags: ['HLD Deep Dives', 'LLD Patterns', 'CAP Theorem'],
  },
  {
    icon: MessageSquare,
    title: 'HR & Behavioural',
    description: 'STAR method, conflict resolution, leadership stories. Nail every round beyond the code.',
    accent: 'text-accent',
    iconBg: 'bg-accent/10',
    hoverBorder: 'hover:border-accent/30',
    tags: ['STAR Framework', 'Amazon LPs', 'Negotiation Tips'],
  },
  {
    icon: Briefcase,
    title: 'Resume & Profile',
    description: 'ATS-optimised resume, GitHub green squares, LinkedIn headlines that get callbacks.',
    accent: 'text-yellow-400',
    iconBg: 'bg-yellow-400/10',
    hoverBorder: 'hover:border-yellow-400/30',
    tags: ['Resume Templates', 'GitHub Optimisation', 'Portfolio Guide'],
  },
];

const companies = [
  { name: 'Google', color: '#4285F4', rounds: '4–5 rounds' },
  { name: 'Microsoft', color: '#00A4EF', rounds: '4 rounds' },
  { name: 'Amazon', color: '#FF9900', rounds: '5–6 rounds' },
  { name: 'Flipkart', color: '#2874F0', rounds: '3–4 rounds' },
  { name: 'Atlassian', color: '#0052CC', rounds: '4 rounds' },
  { name: 'Josh Tech', color: '#6366F1', rounds: '3 rounds' },
  { name: 'Juspay', color: '#E84393', rounds: '3–4 rounds' },
  { name: 'Samsung', color: '#1428A0', rounds: '2–3 rounds' },
];

const timeline = [
  { month: 'Month 1–2', task: 'Arrays, Strings, Hashing, Two Pointers', done: true },
  { month: 'Month 3–4', task: 'Trees, Graphs, Recursion, Backtracking', done: true },
  { month: 'Month 5–6', task: 'DP, Greedy, Heap, Advanced DS', done: false },
  { month: 'Month 7–8', task: 'System Design + Mock Interviews', done: false },
  { month: 'Month 9', task: 'Company-specific prep + Resume polish', done: false },
];

export default function PlacementPlaybook() {
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
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="placement" ref={sectionRef} className="py-32 bg-black relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-primary mb-6">
            <Briefcase className="w-3 h-3" />
            Placement Season
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Placement <span className="text-gradient-fire">Playbook</span>
          </h2>
          <p className="text-muted-foreground font-mono leading-relaxed text-lg">
            Everything you need to crack top tech companies: DSA, system design, HR rounds, and the resume that gets you the interview.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 gap-5 mb-16">
          {pillars.map((pillar, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}>
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className="h-full">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`h-full p-7 rounded-2xl bg-card border border-white/5 ${pillar.hoverBorder} transition-all duration-300 group`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl ${pillar.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <pillar.icon className={`w-7 h-7 ${pillar.accent}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${pillar.accent}`}>{pillar.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{pillar.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {pillar.tags.map((tag) => (
                          <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-white/50 border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className={`w-5 h-5 text-white/20 group-hover:translate-x-1 transition-all shrink-0 mt-1 ${pillar.accent}`} />
                  </div>
                </motion.div>
              </Tilt>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Timeline */}
          <div className="p-7 rounded-2xl bg-card border border-white/5">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" /> 9-Month Prep Timeline
            </h3>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 border-2 ${item.done ? 'bg-primary border-primary' : 'bg-transparent border-white/30'}`} />
                    {i < timeline.length - 1 && <div className="w-[1px] flex-1 mt-1 bg-white/10" />}
                  </div>
                  <div className="pb-6">
                    <div className="font-mono text-xs text-primary mb-0.5">{item.month}</div>
                    <div className={`text-sm ${item.done ? 'text-white' : 'text-white/50'}`}>{item.task}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Tracker */}
          <div className="p-7 rounded-2xl bg-card border border-white/5">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-secondary" /> Target Companies
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {companies.map((co, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/15 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: co.color }} />
                    <span className="font-mono text-sm text-white/80 group-hover:text-white transition-colors">{co.name}</span>
                  </div>
                  <span className="font-mono text-xs text-white/30">{co.rounds}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/15 font-mono text-xs text-white/40 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
              <ArrowRight className="w-3.5 h-3.5" /> View All Company Guides
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
