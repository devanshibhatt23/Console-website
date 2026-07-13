import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Calendar, MapPin, TerminalSquare } from 'lucide-react';

const events = [
  {
    title: 'HackConsole 2025',
    date: 'Oct 15-17',
    location: 'Main Auditorium',
    type: 'Hackathon',
    color: 'primary',
    description: 'Our flagship 48-hour hackathon. Build something awesome, win massive prizes, survive on pizza.'
  },
  {
    title: 'WebDev Bootcamp',
    date: 'Nov 02',
    location: 'Lab 304',
    type: 'Workshop',
    color: 'secondary',
    description: 'Zero to full-stack in a weekend. Learn React, Node, and how to actually use Git without crying.'
  },
  {
    title: 'Midnight CTF',
    date: 'Nov 18',
    location: 'Virtual',
    type: 'Competition',
    color: 'destructive',
    description: 'Capture The Flag night. Find the vulnerabilities, exploit the systems, claim the root flag.'
  },
  {
    title: 'AI/ML Study Jam',
    date: 'Dec 05',
    location: 'Lab 201',
    type: 'Study Group',
    color: 'accent',
    description: 'Demystifying neural networks. Bring your laptop, we provide the GPUs in the cloud.'
  }
];

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      );

      gsap.fromTo(cardsRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'text-primary border-primary bg-primary/10';
      case 'secondary': return 'text-secondary border-secondary bg-secondary/10';
      case 'destructive': return 'text-destructive border-destructive bg-destructive/10';
      case 'accent': return 'text-accent border-accent bg-accent/10';
      default: return 'text-white border-white/20 bg-white/5';
    }
  };

  return (
    <section id="events" ref={sectionRef} className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div ref={headerRef} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-secondary mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Calendar
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Where the magic <br /> <span className="text-white/50">happens.</span>
            </h2>
          </div>
          
          <button className="font-mono text-sm border-b border-primary text-primary pb-1 hover:text-white hover:border-white transition-colors self-start md:self-end">
            View All Events &gt;
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <div key={index} ref={el => { cardsRef.current[index] = el; }}>
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                glareEnable={true}
                glareMaxOpacity={0.1}
                glareColor="#ffffff"
                className="h-full"
              >
                <div className="terminal-panel h-full p-1 rounded-xl group relative">
                  {/* Glowing border effect on hover based on event color */}
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    event.color === 'primary' ? 'glow-indigo' : 
                    event.color === 'secondary' ? 'glow-cyan' : 
                    'shadow-[0_0_20px_0_rgba(255,255,255,0.1)]'
                  }`} />
                  
                  <div className="bg-card rounded-lg h-full p-8 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full font-mono text-xs border ${getColorClasses(event.color)}`}>
                        {event.type}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <TerminalSquare className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                    <p className="text-muted-foreground mb-8 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-white/5 font-mono text-sm">
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4 text-primary" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4 text-secondary" />
                        {event.location}
                      </div>
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
