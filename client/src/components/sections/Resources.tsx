import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Brain, Globe, Shield, Link2, Code2, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const domains = [
  {
    tag: 'web-dev',
    title: 'Web Development',
    icon: Globe,
    description: 'Full-stack foundations to advanced React patterns. HTML/CSS → JavaScript → React → Node → Databases.',
    level: 'Beginner',
    duration: '6 months',
    accentColor: 'text-blue-400',
    tagColor: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    iconBg: 'bg-blue-400/10 border-blue-400/20',
    hoverBorder: 'hover:border-blue-400/30',
    ext: '.tsx',
    resources: ['Frontend Roadmap', 'React Patterns', 'Node.js Guide', 'SQL Cheatsheet'],
  },
  {
    tag: 'ai-ml',
    title: 'AI / Machine Learning',
    icon: Brain,
    description: 'Python to production ML. Statistics, sklearn, PyTorch, NLP, Computer Vision, one curated path.',
    level: 'Advanced',
    duration: '9 months',
    accentColor: 'text-purple-400',
    tagColor: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    iconBg: 'bg-purple-400/10 border-purple-400/20',
    hoverBorder: 'hover:border-purple-400/30',
    ext: '.py',
    resources: ['ML Fundamentals', 'PyTorch Guide', 'NLP Roadmap', 'Kaggle Strategy'],
  },
  {
    tag: 'cp',
    title: 'Competitive Programming',
    icon: Code2,
    description: 'DSA mastery for CP and interviews. Arrays → DP → Graphs → Segment Trees, rated up for real.',
    level: 'Intermediate',
    duration: '4 months',
    accentColor: 'text-yellow-400',
    tagColor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    iconBg: 'bg-yellow-400/10 border-yellow-400/20',
    hoverBorder: 'hover:border-yellow-400/30',
    ext: '.cpp',
    resources: ['Codeforces Ladder', 'SDE Sheet', 'CSES Problemset', 'CP Algorithms'],
  },
  {
    tag: 'security',
    title: 'Cybersecurity',
    icon: Shield,
    description: 'Ethical hacking, CTF skills, OWASP vulnerabilities, cryptography, and pentesting fundamentals.',
    level: 'Intermediate',
    duration: '7 months',
    accentColor: 'text-red-400',
    tagColor: 'text-red-400 bg-red-400/10 border-red-400/20',
    iconBg: 'bg-red-400/10 border-red-400/20',
    hoverBorder: 'hover:border-red-400/30',
    ext: '.sh',
    resources: ['OWASP Top 10', 'TryHackMe Path', 'CTF Writeups', 'Crypto Guide'],
  },
  {
    tag: 'cpp',
    title: 'C++ Programming',
    icon: Cpu,
    description: 'Master C++ fundamentals, OOP, STL, memory management, and systems-level concurrency.',
    level: 'Intermediate',
    duration: '4 months',
    accentColor: 'text-orange-400',
    tagColor: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    iconBg: 'bg-orange-400/10 border-orange-400/20',
    hoverBorder: 'hover:border-orange-400/30',
    ext: '.cpp',
    resources: ['C++ STL Guide', 'OOP Patterns', 'Memory Tips', 'Threading Basics'],
  },
  {
    tag: 'web3',
    title: 'Web3 & Blockchain',
    icon: Link2,
    description: 'Solidity smart contracts, DeFi protocols, NFT marketplaces, and dApp frontends with ethers.js.',
    level: 'Intermediate',
    duration: '5 months',
    accentColor: 'text-teal-400',
    tagColor: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    iconBg: 'bg-teal-400/10 border-teal-400/20',
    hoverBorder: 'hover:border-teal-400/30',
    ext: '.sol',
    resources: ['Solidity Docs', 'Hardhat Guide', 'DeFi Intro', 'ethers.js Cheat'],
  },
];

export default function Resources() {
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
          opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="resources" ref={sectionRef} className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div ref={headerRef} className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-primary mb-6">
            <Terminal className="w-3 h-3" />
            Student Resources
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-mono mb-4 text-white tracking-tight">
            ~/resources<span className="animate-pulse text-primary">_</span>
          </h2>
          <p className="text-muted-foreground font-mono max-w-2xl text-lg">
            Curated learning paths across every domain we teach. Crafted by seniors, refined by the community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domains.map((domain, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 280 }}
                className="h-full group cursor-pointer"
              >
                <div className={`terminal-panel h-full rounded-xl overflow-hidden border border-white/5 ${domain.hoverBorder} transition-all duration-300`}>
                  {/* Terminal Header */}
                  <div className="terminal-header px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="mx-auto font-mono text-xs text-white/40 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3" />
                      {domain.tag}{domain.ext}
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-black/50 flex flex-col h-[calc(100%-48px)]">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${domain.iconBg}`}>
                        <domain.icon className={`w-6 h-6 ${domain.accentColor}`} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold text-white transition-colors ${domain.accentColor}`}>
                          {domain.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-white/40">{domain.level}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-xs font-mono text-white/40">{domain.duration}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                      {domain.description}
                    </p>

                    {/* Resource chips */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {domain.resources.map((r) => (
                        <span key={r} className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                          {r}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${domain.tagColor}`}>
                        /{domain.tag}
                      </span>
                      <span className={`font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ${domain.accentColor}`}>
                        Explore <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
