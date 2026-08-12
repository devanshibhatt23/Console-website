import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Clock, Terminal, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { getEvents } from '../../services/eventService';
import { Link } from 'react-router-dom';


gsap.registerPlugin(ScrollTrigger);

const LEGACY_EXACT_EVENTS = [
  ["orientation"],
  ["ai x programming", "ai × programming"],
  ["confluence"],
  ["git-wars"],
  ["recruitment"],
  ["concode"],
];

function getOrderIndex(title: string) {
  const lower = (title || "").toLowerCase().trim();
  const idx = LEGACY_EXACT_EVENTS.findIndex((aliases) => aliases.includes(lower));
  return idx === -1 ? LEGACY_EXACT_EVENTS.length : idx;
}

function getEventActualDate(title: string, dbDate: string): Date {
  const lower = (title || "").toLowerCase().trim();
  if (lower === "orientation") {
    return new Date("2025-09-06T17:19:01Z");
  }
  if (lower === "ai x programming" || lower === "ai × programming") {
    return new Date("2025-10-13T17:23:28Z");
  }
  if (lower === "confluence") {
    return new Date("2026-01-17T20:03:40Z");
  }
  if (lower === "git-wars") {
    return new Date("2026-02-14T17:16:36Z");
  }
  if (lower === "recruitment") {
    return new Date("2026-04-01T16:22:01Z");
  }
  if (lower === "concode") {
    return new Date("2026-04-11T17:15:00Z");
  }
  return new Date(dbDate);
}

function formatEventDisplayDate(title: string, eventDate: string): string {
  const lower = (title || "").toLowerCase().trim();
  if (lower === "orientation") {
    return "Sep 6, 2025";
  }
  if (lower === "ai x programming" || lower === "ai × programming") {
    return "Oct 13, 2025";
  }
  if (lower === "confluence") {
    return "Jan 17, 2026";
  }
  if (lower === "git-wars") {
    return "Feb 14, 2026";
  }
  if (lower === "recruitment") {
    return "Mar–Apr 2026";
  }
  if (lower === "concode") {
    return "Apr 11, 2026";
  }

  try {
    const d = new Date(eventDate);
    if (isNaN(d.getTime())) return "TBA";
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
    
    if (idxA < LEGACY_EXACT_EVENTS.length && idxB < LEGACY_EXACT_EVENTS.length) {
      return idxA - idxB;
    }
    
    const dateA = getEventActualDate(a.title, a.event_date || 0);
    const dateB = getEventActualDate(b.title, b.event_date || 0);
    return dateA.getTime() - dateB.getTime();
  });
}

export default function UpcomingEvents({ prefetchedEvents }: { prefetchedEvents?: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(!prefetchedEvents);

  function processEvents(allEvents: any[]) {
    const now = new Date();
    const futureEvents = allEvents.filter((e: any) => getEventActualDate(e.title, e.event_date) >= now);
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
    return mapped;
  }

  // If pre-fetched data is provided, use it directly (no loading needed)
  useEffect(() => {
    if (prefetchedEvents) {
      setUpcomingEvents(processEvents(prefetchedEvents));
      setLoading(false);
      return;
    }
    // Otherwise fetch independently
    async function fetchUpcoming() {
      try {
        const allEvents = await getEvents();
        if (allEvents) {
          setUpcomingEvents(processEvents(allEvents));
        }
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpcoming();
  }, [prefetchedEvents]);

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
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, upcomingEvents.length]);

  return (
    <section id="upcoming-events" ref={sectionRef} className="pt-20 pb-8 bg-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div ref={headerRef} className="text-center mb-14 mt-19">
          <h2 className="section-gradient-title section-title text-4xl md:text-5xl">
            Upcoming Events
          </h2>
          <div>
            <Link
              to="/events"
              className="inline-block mt-2 font-mono text-sm font-semibold text-primary transition-transform duration-300 ease-out hover:scale-[1.02] hover:drop-shadow-[0_0_12px_rgba(240,64,92,0.6)]"
            >
              View all events
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="max-w-5xl mx-auto mb-19 animate-pulse">
            <div className="terminal-panel rounded-2xl overflow-hidden opacity-50">
              <div className="terminal-header px-5 py-3.5 flex items-center gap-3 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="p-6 md:p-8 bg-black/30 h-48 flex flex-col gap-4">
                <div className="h-6 w-1/4 bg-white/5 rounded" />
                <div className="h-8 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 border-dashed">
            <h3 className="text-xl font-bold text-white mb-2">No Upcoming Events</h3>
            <p className="text-muted-foreground font-mono text-sm">We're planning something exciting. Stay tuned!</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto mb-19">
            {upcomingEvents.map((event, i) => (
              <div key={i} ref={el => { cardsRef.current[i] = el; }}>
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
                      console/events/{event.title.toLowerCase().replace(/\s+/g, '_')}.upcoming()
                    </div>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${event.statusColor} flex items-center gap-1.5`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {event.status}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 bg-black/50">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`text-sm font-mono px-3 py-1 rounded-full border ${event.typeColor}`}>
                          {event.type}
                        </span>
                        <span className="font-mono text-xs text-white/40">T-{event.daysLeft} days away</span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h3>

                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>

                      <div className="space-y-2 font-mono text-xs text-white/60 pt-2">
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
                    </div>
                  </div>

                  <div className="px-6 md:px-8 py-5 bg-black/50 border-t border-white/10 flex justify-end">
                    <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-mono text-sm font-bold cursor-default">
                      Stay Tuned
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
