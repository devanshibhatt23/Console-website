import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Tilt from 'react-parallax-tilt';
import { Calendar, MapPin, TerminalSquare, Users, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getEvents } from '../../services/eventService';

gsap.registerPlugin(ScrollTrigger);

const EVENT_ORDER = [
  "orientation",
  "ai x programming",
  "confluence",
  "git",
  "recruitment",
  "concode",
];

function getOrderIndex(title: string) {
  const lower = title.toLowerCase();
  const idx = EVENT_ORDER.findIndex((k) => lower.includes(k));
  return idx === -1 ? EVENT_ORDER.length : idx;
}

function getEventActualDate(title: string, dbDate: string): Date {
  const lower = title.toLowerCase();
  if (lower.includes("orientation")) {
    return new Date("2025-09-06T17:19:01Z");
  }
  if (lower.includes("ai x programming") || lower.includes("ai × programming")) {
    return new Date("2025-10-13T17:23:28Z");
  }
  if (lower.includes("confluence")) {
    return new Date("2026-01-17T20:03:40Z");
  }
  if (lower.includes("git")) {
    return new Date("2026-02-14T17:16:36Z");
  }
  if (lower.includes("recruitment")) {
    return new Date("2026-04-01T16:22:01Z");
  }
  if (lower.includes("concode") || lower.includes("con-code")) {
    return new Date("2026-04-11T17:15:00Z");
  }
  return new Date(dbDate);
}

function formatEventDisplayDate(title: string, eventDate: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("orientation")) {
    return "Sep 6, 2025";
  }
  if (lower.includes("ai x programming") || lower.includes("ai × programming")) {
    return "Oct 13, 2025";
  }
  if (lower.includes("confluence")) {
    return "Jan 17, 2026";
  }
  if (lower.includes("git")) {
    return "Feb 14, 2026";
  }
  if (lower.includes("recruitment")) {
    return "Mar–Apr 2026";
  }
  if (lower.includes("concode") || lower.includes("con-code")) {
    return "Apr 11, 2026";
  }

  try {
    const d = new Date(eventDate);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return "TBA";
  }
}

function sortEvents(events: any[]) {
  return [...events].sort((a, b) => {
    const idxA = getOrderIndex(a.title);
    const idxB = getOrderIndex(b.title);
    
    if (idxA < EVENT_ORDER.length && idxB < EVENT_ORDER.length) {
      return idxA - idxB;
    }
    
    const dateA = getEventActualDate(a.title, a.event_date || 0);
    const dateB = getEventActualDate(b.title, b.event_date || 0);
    return dateA.getTime() - dateB.getTime();
  });
}

const fallbackEvents = [
  {
    title: 'HackConsole 2024',
    date: 'Oct 12–14, 2024',
    location: 'Main Auditorium',
    type: 'Hackathon',
    color: 'primary',
    participants: '200+',
    outcome: '🏆 42 projects shipped',
    description: 'Our flagship 48-hour hackathon. Teams built everything from AI tools to IoT systems. Chaos, caffeine, and incredible results.'
  },
  {
    title: 'WebDev Sprint \'24',
    date: 'Aug 22, 2024',
    location: 'Lab 304',
    type: 'Workshop',
    color: 'secondary',
    participants: '80+',
    outcome: '✅ 80% built a live site',
    description: 'Zero to full-stack in one day. Participants shipped live React + Node projects by EOD. Fastest learning curve in club history.'
  },
  {
    title: 'CTF Night 2024',
    date: 'Sep 18, 2024',
    location: 'Virtual',
    type: 'Competition',
    color: 'destructive',
    participants: '60+',
    outcome: '🚩 3 teams ranked top-100',
    description: 'Three of our teams cracked top-100 nationally. pwn, crypto, web — all categories conquered. Console sends its regards.'
  },
  {
    title: 'AI Study Jam',
    date: 'Jul 05, 2024',
    location: 'Lab 201',
    type: 'Study Group',
    color: 'accent',
    participants: '50+',
    outcome: '🤖 10 ML models deployed',
    description: 'Cloud GPUs, mentors, and the best ML papers of 2024. Ten participants pushed working models to production.'
  },
  {
    title: 'Open Source Sprint',
    date: 'Mar 15, 2024',
    location: 'Seminar Hall',
    type: 'Sprint',
    color: 'primary',
    participants: '40+',
    outcome: '💻 120 PRs merged',
    description: 'One weekend, 120 pull requests merged to real open-source projects. Some landed in projects with 10k+ stars.'
  },
  {
    title: 'Resume Roast Session',
    date: 'Feb 10, 2024',
    location: 'Online',
    type: 'Workshop',
    color: 'secondary',
    participants: '90+',
    outcome: '📄 90% secured callbacks',
    description: 'Brutally honest resume reviews by alumni from Google, Atlassian, and Flipkart. Painful but effective.'
  },
];

export default function PreviousEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [displayEvents, setDisplayEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Colors to cycle through
  const colors = ['primary', 'secondary', 'destructive', 'accent', 'white'];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        if (data && data.length > 0) {
          // Sort events chronologically
          const sortedData = sortEvents(data);

          // Filter for past events relative to current time (July 13, 2026)
          const now = new Date();
          const pastEvents = sortedData.filter((evt: any) => getEventActualDate(evt.title, evt.event_date) < now);

          // Map DB schema to UI schema
          const mapped = pastEvents.map((evt: any, i: number) => ({
            title: evt.title,
            date: formatEventDisplayDate(evt.title, evt.event_date),
            location: evt.venue || 'TBA',
            type: evt.title.toLowerCase().includes('hack') ? 'Hackathon' : 
                  evt.title.toLowerCase().includes('sprint') ? 'Sprint' : 
                  evt.title.toLowerCase().includes('ctf') ? 'Competition' : 'Event',
            color: colors[i % colors.length],
            participants: '50+', // Default since DB doesn't have it
            outcome: '🔥 Completed Successfully', // Default
            description: evt.description || 'Join us for this amazing event. Learn, build, and grow together.',
            image_url: evt.image_url
          }));
          setDisplayEvents(mapped);
        } else {
          setDisplayEvents(fallbackEvents);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setDisplayEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait for events to load before animating

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: headerRef.current, start: 'top 85%' } }
      );
      gsap.fromTo(cardsRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, displayEvents.length]);

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
    <section id="previous-events" ref={sectionRef} className="py-32 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div ref={headerRef} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-secondary mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              Archive
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Where the magic <br /> <span className="text-white/50">happened.</span>
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayEvents.map((event, index) => (
            <div key={index} ref={el => { cardsRef.current[index] = el; }}>
              <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.08} glareColor="#ffffff" className="h-full">
                <div 
                  className="terminal-panel h-full p-1 rounded-xl group relative cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    event.color === 'primary' ? 'glow-indigo' :
                    event.color === 'secondary' ? 'glow-cyan' :
                    'shadow-[0_0_20px_0_rgba(255,255,255,0.07)]'
                  }`} />

                  <div className="bg-card rounded-lg h-full p-6 relative z-10 flex flex-col">
                    <div className="flex justify-between items-start mb-5">
                      <div className={`px-3 py-1 rounded-full font-mono text-xs border ${getColorClasses(event.color)}`}>
                        {event.type}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center">
                        <TerminalSquare className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>

                    {/* Outcome badge */}
                    <div className="mb-4 px-3 py-2 rounded-lg bg-white/3 border border-white/5 font-mono text-xs text-white/60">
                      {event.outcome}
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2 text-white/50">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {event.date}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/50">
                          <MapPin className="w-3.5 h-3.5 text-secondary" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Users className="w-3 h-3" />
                          {event.participants}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f11] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-white/10 text-white transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>

              {/* Modal Image */}
              {selectedEvent.image_url ? (
                <div className="w-full h-64 md:h-80 relative bg-black shrink-0">
                  <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/40 to-transparent" />
                </div>
              ) : (
                <div className={`w-full h-48 md:h-64 relative bg-white/5 shrink-0`}>
                  <div className={`absolute inset-0 opacity-20 ${getColorClasses(selectedEvent.color).split(' ')[2]}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent" />
                </div>
              )}

              {/* Modal Content */}
              <div className="p-6 md:p-8 overflow-y-auto">
                <div className="flex flex-wrap gap-2 items-center mb-5">
                  <span className={`px-3 py-1 rounded-full font-mono text-xs border ${getColorClasses(selectedEvent.color)}`}>
                    {selectedEvent.type}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-white/60">
                    {selectedEvent.outcome}
                  </span>
                </div>

                <h3 className="text-3xl font-bold mb-6">{selectedEvent.title}</h3>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 font-mono text-sm text-white/50 border-y border-white/10 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    {selectedEvent.participants}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px]">
                  {selectedEvent.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
