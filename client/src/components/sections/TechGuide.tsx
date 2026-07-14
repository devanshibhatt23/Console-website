import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const guides = [
  {
    domain: 'Web Development',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-400/10',
    hoverBorder: 'hover:border-blue-400/30',
    tag: 'web-dev',
    steps: [
      'HTML & CSS fundamentals',
      'JavaScript ES6+ mastery',
      'React & component patterns',
      'Node.js & REST APIs',
      'Databases (SQL & NoSQL)',
      'Deployment & DevOps basics',
    ],
    duration: '~6 months',
    level: 'Beginner → Hireable',
  },
  {
    domain: 'Competitive Programming',
    accent: 'text-yellow-400',
    iconBg: 'bg-yellow-400/10',
    hoverBorder: 'hover:border-yellow-400/30',
    tag: 'cp',
    steps: [
      'C++ STL & complexity analysis',
      'Arrays, Strings, Recursion',
      'DP & greedy algorithms',
      'Graphs: BFS, DFS, Dijkstra',
      'Segment trees & advanced DS',
      'Contest strategy & mindset',
    ],
    duration: '~8 months',
    level: 'Newbie → Expert',
  },
  {
    domain: 'Machine Learning & AI',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-400/10',
    hoverBorder: 'hover:border-purple-400/30',
    tag: 'ai-ml',
    steps: [
      'Python + NumPy + Pandas',
      'Statistics & linear algebra',
      'Classical ML (sklearn)',
      'Neural networks (PyTorch)',
      'NLP & Computer Vision',
      'Model deployment & MLOps',
    ],
    duration: '~9 months',
    level: 'Novice → ML Engineer',
  },
  {
    domain: 'Cybersecurity',
    accent: 'text-red-400',
    iconBg: 'bg-red-400/10',
    hoverBorder: 'hover:border-red-400/30',
    tag: 'security',
    steps: [
      'Networking fundamentals',
      'Linux & command line mastery',
      'Web vulnerabilities (OWASP)',
      'Cryptography basics',
      'CTF writeups & practice',
      'Ethical hacking & pentesting',
    ],
    duration: '~7 months',
    level: 'Script Kiddie → Hacker',
  },
  {
    domain: 'Web3 & Blockchain',
    accent: 'text-teal-400',
    iconBg: 'bg-teal-400/10',
    hoverBorder: 'hover:border-teal-400/30',
    tag: 'web3',
    steps: [
      'Blockchain fundamentals',
      'Solidity smart contracts',
      'Hardhat & testing',
      'DeFi protocols & tokenomics',
      'NFTs & marketplaces',
      'dApp frontend (ethers.js)',
    ],
    duration: '~6 months',
    level: 'Curious → dApp Dev',
  },
  {
    domain: 'C++ & Systems',
    accent: 'text-orange-400',
    iconBg: 'bg-orange-400/10',
    hoverBorder: 'hover:border-orange-400/30',
    tag: 'cpp',
    steps: [
      'C++ fundamentals & pointers',
      'OOP & design patterns',
      'Memory management',
      'STL deep dive',
      'Multithreading & concurrency',
      'OS internals & system calls',
    ],
    duration: '~5 months',
    level: 'Beginner → Systems Dev',
  },
];

export default function TechGuide() {
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
    <section id="tech-guide" ref={sectionRef} className="py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="max-w-3xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-secondary mb-6">
            <BookOpen className="w-3 h-3" />
            Learning Paths
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Tech <span className="text-gradient-fire">Guide</span>
          </h2>
          <p className="text-muted-foreground font-mono leading-relaxed text-lg">
            Structured roadmaps for every domain we teach. Pick a path and follow the steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 280 }}
                className={`h-full p-6 rounded-2xl bg-card border border-white/5 ${guide.hoverBorder} transition-all duration-300 group overflow-hidden relative cursor-pointer`}
              >
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded border border-white/10 bg-white/5 mb-2 inline-block ${guide.accent}`}>
                        /{guide.tag}
                      </span>
                      <h3 className={`text-lg font-bold text-white transition-colors ${guide.accent}`}>
                        {guide.domain}
                      </h3>
                    </div>
                    <ArrowRight className={`w-5 h-5 text-white/20 group-hover:translate-x-1 transition-all shrink-0 mt-1 ${guide.accent}`} />
                  </div>

                  {/* Steps */}
                  <ul className="space-y-2 mb-6">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-sm text-white/60">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${guide.accent} opacity-70`} />
                        {step}
                      </li>
                    ))}
                  </ul>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between font-mono text-xs text-white/40">
                    <span>{guide.duration}</span>
                    <span className={guide.accent}>{guide.level}</span>
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
