import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
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

export default function UpcomingEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        const allEvents = await getEvents();
        if (allEvents) {
          const now = new Date();
          const futureEvents = allEvents.filter((e: any) => getEventActualDate(e.title, e.event_date) >= now);
          // Only the single nearest upcoming event
          const sortedData = sortEvents(futureEvents).slice(0, 1);
          
          const mapped = sortedData.map((evt: any) => {
            const evDate = getEventActualDate(evt.title, evt.event_date);
            const daysLeft = Math.ceil((evDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
            const isHack = evt.title.toLowerCase().includes('hack');
            
            return {
              title: evt.title,
              date: formatEventDisplayDate(evt.title, evt.event_date),
              time: evDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
              location: evt.venue || 'TBA',
              type: isHack ? 'Hackathon' : evt.title.toLowerCase().includes('ctf') ? 'Competition' : 'Event',
              status: daysLeft <= 7 ? 'Registration Open' : 'Upcoming',
              statusColor: daysLeft <= 7 ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
              typeColor: isHack ? 'text-primary border-primary/30 bg-primary/10' : 'text-secondary border-secondary/30 bg-secondary/10',
              description: evt.description || 'Join us for this exciting upcoming event!',
              daysLeft: daysLeft
            };
          });
          setUpcomingEvents(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
        }
      );
      if (upcomingEvents.length > 0) {
        gsap.fromTo(cardsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, upcomingEvents.length]);

  return (
    <section id="upcoming-events" ref={sectionRef} className="py-24 bg-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="text-center mb-14">
          <h2 className="section-gradient-title section-title text-4xl md:text-5xl">
            Upcoming Events
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 border-dashed">
            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground font-mono text-sm">We're planning something exciting. Stay tuned!</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-5">
            {upcomingEvents.map((event, i) => (
              <div key={i} ref={el => { cardsRef.current[i] = el; }} className="w-full max-w-sm">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-full bg-card border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-white/15 transition-colors duration-300 flex flex-col"
                >
                  {/* Top accent bar */}
                  <div className={`h-[2px] w-full ${
                    i === 0 ? 'bg-gradient-fire' : i === 1 ? 'bg-gradient-to-r from-secondary to-cyan-400' : 'bg-gradient-to-r from-destructive to-pink-500'
                  }`} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-5">
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${event.typeColor}`}>
                        {event.type}
                      </span>
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${event.statusColor} flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {event.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {event.description}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2 font-mono text-xs text-white/60 border-t border-white/5 pt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        {event.location}
                      </div>
                    </div>

                    {/* Days left */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="font-mono text-xs text-white/40">T-{event.daysLeft} days</span>
                      <div className="w-full mx-3 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${i === 0 ? 'bg-gradient-fire' : i === 1 ? 'bg-secondary' : 'bg-destructive'}`}
                          style={{ width: `${Math.max(5, 100 - event.daysLeft * 2)}%` }}
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
