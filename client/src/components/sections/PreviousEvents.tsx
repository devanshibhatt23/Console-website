import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';

gsap.registerPlugin(ScrollTrigger);

const SHOWN_EVENTS = ['concode', 'git', 'confluence'];

function getOrderIndex(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('concode') || lower.includes('con-code')) return 0;
  if (lower.includes('git')) return 1;
  if (lower.includes('confluence')) return 2;
  return 99;
}

function formatEventDisplayDate(title: string, eventDate: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('confluence')) return 'Jan 17, 2026';
  if (lower.includes('git')) return 'Feb 14, 2026';
  if (lower.includes('concode') || lower.includes('con-code')) return 'Apr 11, 2026';
  try {
    const d = new Date(eventDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'TBA';
  }
}

function getEventType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('concode') || lower.includes('con-code')) return 'Hackathon';
  if (lower.includes('git')) return 'Workshop';
  if (lower.includes('confluence')) return 'Event';
  return 'Event';
}

function getEventVenue(title: string, venue: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('confluence')) return 'NIT Jaipur Campus';
  if (lower.includes('git')) return 'Computer Lab';
  if (lower.includes('concode') || lower.includes('con-code')) return 'NIT Jaipur Campus';
  return venue || 'TBA';
}

const fallbackEvents = [
  {
    title: 'Confluence',
    date: 'Jan 17, 2026',
    location: 'NIT Jaipur Campus',
    type: 'Event',
    participants: '200+',
    description:
      'Our annual tech fest bringing together developers, designers, and innovators for a day of learning, networking, and collaboration.',
    image_url: 'https://gxbhswojyrlifgqhjwqv.supabase.co/storage/v1/object/public/event-images/IMG_20260117_134333116_HDR.jpg',
  },
  {
    title: 'Git-Wars',
    date: 'Feb 14, 2026',
    location: 'Computer Lab',
    type: 'Workshop',
    participants: '80+',
    description:
      'A hands-on Git and open-source contribution workshop where participants learned version control and shipped real pull requests to live repositories.',
    image_url: '',
  },
  {
    title: 'CONCODE',
    date: 'Apr 11, 2026',
    location: 'NIT Jaipur Campus',
    type: 'Hackathon',
    participants: '150+',
    description:
      'Console\'s flagship coding competition. Teams competed across multiple rounds of algorithmic challenges, system design, and live coding, with some of the best minds in MNIT.',
    image_url: 'https://gxbhswojyrlifgqhjwqv.supabase.co/storage/v1/object/public/event-images/WhatsApp%20Image%202026-04-14%20at%2012.52.18.jpeg',
  },
];

export default function PreviousEvents() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [displayEvents, setDisplayEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        if (data && data.length > 0) {
          const filtered = data.filter((evt: any) => {
            const lower = evt.title.toLowerCase();
            return SHOWN_EVENTS.some((k) => lower.includes(k));
          });

          const mapped = filtered
            .map((evt: any) => ({
              title: evt.title,
              date: formatEventDisplayDate(evt.title, evt.event_date),
              location: getEventVenue(evt.title, evt.venue),
              type: getEventType(evt.title),
              participants: '100+',
              description:
                evt.description ||
                'An incredible event organized by Console Club for the MNIT community.',
              image_url: evt.image_url || '',
              _order: getOrderIndex(evt.title),
            }))
            .sort((a: any, b: any) => a._order - b._order);

          setDisplayEvents(mapped.length > 0 ? mapped : fallbackEvents);
        } else {
          setDisplayEvents(fallbackEvents);
        }
      } catch {
        setDisplayEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        }
      );
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      );
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, sectionRef);
    return () => ctx.revert();
  }, [loading, displayEvents.length]);

  return (
    <section id="previous-events" ref={sectionRef} className="py-20 bg-black relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col items-center text-center mb-20 gap-4">
          <h2 className="section-gradient-title text-4xl md:text-5xl tracking-tight">
            Events
          </h2>
          {/* View all events */}
          <Link
            to="/events"
            className="inline-flex items-center gap-2 font-inter font-medium text-sm transition-all duration-200 hover:scale-[1.02] group"
            style={{ color: '#F2994A' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.textShadow = '0 0 12px rgba(242,153,74,0.6)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.textShadow = 'none';
            }}
          >
            View all events
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayEvents.slice(0, 3).map((event, index) => (
            <div key={index} ref={(el) => { cardsRef.current[index] = el; }}>
              <div
                className="h-full rounded-xl border border-white/10 bg-[#0a0a0a] cursor-pointer transition-all duration-300 overflow-hidden flex flex-col"
                onClick={() => setSelectedEvent(event)}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(242,153,74,0.45)';
                  el.style.borderRadius = '1.25rem';
                  el.style.boxShadow = '0 0 24px rgba(242,153,74,0.2), 0 0 48px rgba(242,153,74,0.08)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.1)';
                  el.style.borderRadius = '0.75rem';
                  el.style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                {event.image_url ? (
                  <div className="w-full h-44 overflow-hidden shrink-0">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full h-44 shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(242,153,74,0.15), rgba(240,64,92,0.1))' }}
                  />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Type badge */}
                  <span
                    className="self-start px-3 py-1 rounded-full font-mono text-xs border mb-4"
                    style={{
                      borderColor: 'rgba(242,153,74,0.4)',
                      color: '#F2994A',
                      background: 'rgba(242,153,74,0.08)',
                    }}
                  >
                    {event.type}
                  </span>

                  <h3 className="text-xl font-bold font-montserrat mb-3 text-white">{event.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1 font-inter">
                    {event.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-4 border-t border-white/5 font-mono text-xs">
                    <div className="flex items-center gap-2 text-white/50">
                      <Calendar className="w-3.5 h-3.5" style={{ color: '#F2994A' }} />
                      {event.date}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/50">
                        <MapPin className="w-3.5 h-3.5" style={{ color: '#F0405C' }} />
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
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
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

              {selectedEvent.image_url ? (
                <div className="w-full h-64 md:h-80 relative bg-black shrink-0">
                  <img
                    src={selectedEvent.image_url}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/40 to-transparent" />
                </div>
              ) : (
                <div
                  className="w-full h-48 shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(242,153,74,0.2), rgba(240,64,92,0.15))' }}
                />
              )}

              <div className="p-6 md:p-8 overflow-y-auto">
                <span
                  className="inline-block px-3 py-1 rounded-full font-mono text-xs border mb-5"
                  style={{ borderColor: 'rgba(242,153,74,0.4)', color: '#F2994A', background: 'rgba(242,153,74,0.08)' }}
                >
                  {selectedEvent.type}
                </span>

                <h3 className="text-3xl font-bold font-montserrat mb-6 text-white">{selectedEvent.title}</h3>

                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 font-mono text-sm text-white/50 border-y border-white/10 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: '#F2994A' }} />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: '#F0405C' }} />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/40" />
                    {selectedEvent.participants}
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-[15px] font-inter">
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
