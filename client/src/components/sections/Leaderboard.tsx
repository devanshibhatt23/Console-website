import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LeaderboardTable from '../LeaderboardTable';
import '../../pages/Leaderboard.css'; // Ensure the table styles are loaded

export default function Leaderboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await fetch('http://localhost:5001/api/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        let allLeaders: any[] = [];
        
        if (data && data.codeforces) {
          allLeaders = data.codeforces.map((u: any) => ({
            name: u.handle || u.name,
            handle: u.handle,
            rating: u.rating,
          }));
        }

        allLeaders.sort((a, b) => b.rating - a.rating);
        setLeaders(allLeaders.slice(0, 5)); // top 5
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaders();
  }, []);

  useEffect(() => {
    if (isLoading || leaders.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, leaders]);

  return (
    <section id="leaderboard" ref={sectionRef} className="py-20 relative bg-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Hall of <span className="text-gradient-fire">Fame</span>
          </h2>
          <p className="text-muted-foreground font-mono">The top problem solvers in the club.</p>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-2xl bg-card border border-white/10 p-1">
          {isLoading ? (
            <div className="loading-container" style={{ height: '200px' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <LeaderboardTable 
              data={leaders} 
              scoreLabel="Rating" 
              scoreKey="rating" 
              platformId="codeforces" 
            />
          )}
        </div>
      </div>
    </section>
  );
}
