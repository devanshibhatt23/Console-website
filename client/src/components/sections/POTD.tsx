import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPOTD } from '../../services/problemService';

gsap.registerPlugin(ScrollTrigger);

export default function POTD() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [problem, setProblem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodayProblem() {
      try {
        const data = await getPOTD();
        if (data) {
          setProblem({
            id: data.id ? data.id.substring(0, 8) : 'P001',
            title: data.title,
            platform: data.platform === 'leetcode' ? 'LeetCode' : data.platform === 'codeforces' ? 'Codeforces' : 'Custom',
            platformColor: data.platform === 'leetcode' ? 'text-yellow-400' : 'text-blue-400',
            difficulty: data.difficulty,
            diffColor: data.difficulty === 'Easy' ? 'text-green-400 border-green-400/30 bg-green-400/10' : 
                       data.difficulty === 'Hard' ? 'text-red-400 border-red-400/30 bg-red-400/10' : 
                       'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
            tags: ['POTD', data.platform || 'General'],
            acceptance: 'N/A', // Not in DB
            link: data.solution || '#',
            description: data.description,
            hint: 'Focus on the constraints and try to find a pattern. Check the platform for official hints.',
          });
        }
      } catch (err) {
        console.error("Failed to fetch POTD:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTodayProblem();
  }, []);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } }
      );
      if (problem) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } }
        );
      }
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, problem]);

  return (
    <section id="potd" ref={sectionRef} className="py-20 bg-black relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />

      <div className="container mx-auto px-6 max-w-5xl">
        <div ref={headerRef} className="text-center mb-10 mt-2">
          <h2 className="section-gradient-title section-title text-4xl md:text-5xl">
            Problem of the Day
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-3">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <Link
            to="/problem-of-the-day"
            className="inline-block mt-2 font-mono text-sm font-semibold text-primary transition-transform duration-300 ease-out hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(240,64,92,0.6)]"
          >
            View leaderboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !problem ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 border-dashed">
            <h3 className="text-xl font-bold text-white mb-2">No Challenge Today</h3>
            <p className="text-muted-foreground font-mono text-sm">The Problem of the Day hasn't been posted yet. Check back later!</p>
          </div>
        ) : (
          <div ref={cardRef}>
            <div className="terminal-panel rounded-2xl overflow-hidden">
              {/* Terminal chrome */}
              <div className="terminal-header px-5 py-3.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-white/50 mx-auto">
                  <Terminal className="w-3.5 h-3.5" />
                  potd_{problem.id.toLowerCase()}.solve()
                </div>
                <a
                  href={problem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-primary hover:text-white transition-colors flex items-center gap-1"
                >
                  Open <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-6 md:p-8 bg-black/50">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-sm font-mono px-3 py-1 rounded-full border ${problem.diffColor}`}>
                      {problem.difficulty}
                    </span>
                    <span className={`text-sm font-bold font-mono ${problem.platformColor}`}>
                      {problem.platform}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white">{problem.title}</h3>

                  <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              </div>

              {/* Action footer, pinned to the bottom of the terminal box */}
              <div className="px-6 md:px-8 py-5 bg-black/50 border-t border-white/10 flex justify-end">
                <a
                  href={problem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-mono text-sm font-bold hover:bg-primary/80 transition-colors group"
                >
                  Solve Now
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
