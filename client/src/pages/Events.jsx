import React, { useState, useEffect, useRef, useCallback } from "react";
import { getEventsWithImages } from "../services/eventService";
import "./Events.css";

// ── Ordering (Chronological) ──────────────────────────────────────────────────
const EVENT_ORDER = [
  "orientation",
  "ai x programming",
  "confluence",
  "git",
  "recruitment",
  "concode",
];

function getOrderIndex(title) {
  const lower = title.toLowerCase();
  const idx = EVENT_ORDER.findIndex((k) => lower.includes(k));
  return idx === -1 ? EVENT_ORDER.length : idx;
}

function sortEvents(events) {
  return [...events].sort((a, b) => {
    const idxA = getOrderIndex(a.title);
    const idxB = getOrderIndex(b.title);
    
    // If both are predefined legacy events, keep their requested order
    if (idxA < EVENT_ORDER.length && idxB < EVENT_ORDER.length) {
      return idxA - idxB;
    }
    
    // Otherwise, sort chronologically based on the event_date field
    const dateA = new Date(a.event_date || 0);
    const dateB = new Date(b.event_date || 0);
    return dateA - dateB;
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/--+/g, "-")
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Map events to display date format requested
function getEventDisplayDate(title, eventDate) {
  const lower = title.toLowerCase();
  if (lower.includes("orientation")) {
    return { day: "06", month: "SEP", year: "2025" };
  }
  if (lower.includes("ai x programming") || lower.includes("ai × programming")) {
    return { day: "13", month: "OCT", year: "2025" };
  }
  if (lower.includes("confluence")) {
    return { day: "17", month: "JAN", year: "2026" };
  }
  if (lower.includes("git")) {
    return { day: "14", month: "FEB", year: "2026" };
  }
  if (lower.includes("recruitment")) {
    return { day: "MAR", month: "APR", year: "2026" };
  }
  if (lower.includes("concode") || lower.includes("con-code")) {
    return { day: "11", month: "APR", year: "2026" };
  }

  if (!eventDate) return { day: "?", month: "???", year: "????" };
  try {
    const d = new Date(eventDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("default", { month: "short" }).toUpperCase();
    const year = String(d.getFullYear());
    return { day, month, year };
  } catch (e) {
    return { day: "??", month: "???", year: "????" };
  }
}

// Get event category pill text
function getEventCategory(title) {
  const lower = title.toLowerCase();
  if (lower.includes("orientation")) return "ORIENTATION";
  if (lower.includes("ai x programming") || lower.includes("ai × programming")) return "WORKSHOP";
  if (lower.includes("confluence")) return "EVENT";
  if (lower.includes("git")) return "WORKSHOP";
  if (lower.includes("recruitment")) return "RECRUITMENT";
  if (lower.includes("concode") || lower.includes("con-code")) return "HACKATHON";
  return "EVENT";
}

// Dynamic cover image mapper (to prevent blank/null images with premium placeholders)
const FALLBACK_IMAGES = {
  orientation: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000",
  aixprogramming: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1000",
  confluence: "https://gxbhswojyrlifgqhjwqv.supabase.co/storage/v1/object/public/event-images/IMG_20260117_134333116_HDR.jpg",
  gitwars: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000",
  recruitment: "https://gxbhswojyrlifgqhjwqv.supabase.co/storage/v1/object/public/event-images/IMG_4484.HEIC.jpg",
  concode: "https://gxbhswojyrlifgqhjwqv.supabase.co/storage/v1/object/public/event-images/WhatsApp%20Image%202026-04-14%20at%2012.52.18.jpeg"
};

function getEventCoverImage(title, dbImageUrl) {
  if (dbImageUrl && dbImageUrl.trim() !== "") {
    return dbImageUrl;
  }
  const lower = title.toLowerCase();
  if (lower.includes("orientation")) return FALLBACK_IMAGES.orientation;
  if (lower.includes("ai x programming") || lower.includes("ai × programming")) return FALLBACK_IMAGES.aixprogramming;
  if (lower.includes("confluence")) return FALLBACK_IMAGES.confluence;
  if (lower.includes("git")) return FALLBACK_IMAGES.gitwars;
  if (lower.includes("recruitment")) return FALLBACK_IMAGES.recruitment;
  if (lower.includes("concode") || lower.includes("con-code")) return FALLBACK_IMAGES.concode;

  return "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000";
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const raf = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.08) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ events }) {
  const [ref, inView] = useInView(0.2);
  const totalImages = events.reduce(
    (acc, e) => acc + (e.event_images?.filter((i) => i.image_url)?.length || 0), 0
  );
  // Using high values from mockup for professional aesthetic
  const cEvents = useCountUp(6, 1200, inView);
  const cStudents = useCountUp(500, 1400, inView);

  return (
    <div ref={ref} className="ev-stats-card">
      <div className="ev-stat-grid">
        <div className="ev-stat-item">
          <svg className="ev-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="ev-stat-number">{cEvents}+</span>
          <span className="ev-stat-desc">Events Hosted</span>
        </div>
        <div className="ev-stat-divider" />
        <div className="ev-stat-item">
          <svg className="ev-stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <span className="ev-stat-number">{cStudents}+</span>
          <span className="ev-stat-desc">Students Engaged</span>
        </div>
        <div className="ev-stat-divider" />
        <div className="ev-stat-item">
          <span className="ev-stat-number-inf">∞</span>
          <span className="ev-stat-desc">Knowledge Shared</span>
        </div>
      </div>
    </div>
  );
}

// ── Particles ─────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  px: `${Math.random() * 100}%`,
  py: `${Math.random() * 100}%`,
  ps: `${2 + Math.random() * 3}px`,
  pd: `${5 + Math.random() * 7}s`,
  pdelay: `${Math.random() * 5}s`,
}));

function Particles() {
  return (
    <div className="ev-particles" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="ev-particle"
          style={{ "--px": p.px, "--py": p.py, "--ps": p.ps, "--pd": p.pd, "--pdelay": p.pdelay }}
        />
      ))}
    </div>
  );
}

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar({ query, onQuery }) {
  return (
    <div className="ev-search-container">
      <div className="ev-search-box">
        <svg className="ev-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="events-search"
          type="text"
          placeholder="Search events by title..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          className="ev-search-input"
          autoComplete="off"
        />
        {query && (
          <button className="ev-search-clear" onClick={() => onQuery("")} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Timeline Event Item ───────────────────────────────────────────────────────
const TAG_COLORS = ["blue", "purple", "pink", "teal", "amber"];

function TimelineItem({ event, index, onImageClick }) {
  const [itemRef, inView] = useInView(0.06);

  const validImages = (event.event_images || []).filter(
    (img) => img.image_url && img.image_url.trim() !== ""
  );
  const coverImage = getEventCoverImage(event.title, event.image_url);
  const description = cleanText(event.description);
  const tagColor = TAG_COLORS[index % TAG_COLORS.length];
  const displayDate = getEventDisplayDate(event.title, event.event_date);
  const category = getEventCategory(event.title);

  // Compile full gallery image array
  const allCardImages = validImages.length > 0
    ? validImages.map((img) => ({ url: img.image_url, title: event.title }))
    : [{ url: coverImage, title: event.title }];

  return (
    <div
      ref={itemRef}
      className={`ev-timeline-item ev-timeline-item--${tagColor}${inView ? " ev-timeline-item--visible" : ""}`}
      style={{ "--item-delay": `${Math.min(index, 4) * 0.12}s` }}
    >
      {/* Date block */}
      <div className="ev-timeline-date">
        <span className="ev-date-day">{displayDate.day}</span>
        <span className="ev-date-month">{displayDate.month}</span>
        <span className="ev-date-year">{displayDate.year}</span>
      </div>

      {/* Connection dot */}
      <div className="ev-timeline-node">
        <div className="ev-timeline-dot" />
      </div>

      {/* Event Card */}
      <div className="ev-timeline-card">
        <div className="ev-timeline-card-image" onClick={() => onImageClick(allCardImages, 0)}>
          <img src={coverImage} alt={event.title} className="ev-card-img" loading="lazy" />
          <div className="ev-card-img-overlay" />
        </div>

        <div className="ev-timeline-card-content">
          <span className={`ev-card-category ev-card-category--${tagColor}`}>
            {category}
          </span>
          <h2 className="ev-card-title">{event.title}</h2>
          <p className="ev-card-desc">{description}</p>
          <button className="ev-card-gallery-btn" onClick={() => onImageClick(allCardImages, 0)}>
            View Gallery <span className="ev-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const total = images.length;

  const go = useCallback((dir) => {
    setLoaded(false);
    setCurrent((c) => (c + dir + total) % total);
  }, [total]);

  useEffect(() => {
    setLoaded(false);
    setCurrent(startIndex);
  }, [startIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, go]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const img = images[current];

  return (
    <div className="ev-lightbox" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ev-lb-bg" />

      <button className="ev-lb-close" onClick={onClose} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {total > 1 && (
        <>
          <button className="ev-lb-nav ev-lb-nav--prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="ev-lb-nav ev-lb-nav--next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      <div className={`ev-lb-content${loaded ? " ev-lb-content--loaded" : ""}`} onClick={(e) => e.stopPropagation()}>
        {!loaded && <div className="ev-lb-spinner" />}
        <img
          key={img.url}
          src={img.url}
          alt={img.title}
          className="ev-lb-img"
          onLoad={() => setLoaded(true)}
        />
        <div className="ev-lb-footer">
          <p className="ev-lb-caption">{img.title}</p>
          {total > 1 && (
            <div className="ev-lb-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`ev-lb-dot${i === current ? " active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setLoaded(false); setCurrent(i); }}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
          {total > 1 && <span className="ev-lb-counter">{current + 1} / {total}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Back to Top ───────────────────────────────────────────────────────────────
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`ev-back-top${visible ? " ev-back-top--visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

// ── Page Main Component ───────────────────────────────────────────────────────
export default function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState(null); // { images: [], startIndex: 0 }

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEventsWithImages();
        setEvents(sortEvents(data || []));
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const openLightbox = useCallback((images, startIndex) => {
    setLightbox({ images, startIndex });
  }, []);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const filtered = query.trim()
    ? events.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
    : events;

  return (
    <div className="ev-root">
      <Particles />

      {/* ── Hero Section ── */}
      <section className="ev-hero">
        <div className="ev-hero-glow ev-hero-glow--left" />
        <div className="ev-hero-glow ev-hero-glow--right" />
        <div className="ev-hero-glow ev-hero-glow--center" />

        <div className="ev-hero-inner">
          {/* Updated heading with orange-pink gradient per branding requirements */}
          <h1 className="ev-hero-title">Console Events</h1>

          {/* Updated hero description */}
          <p className="ev-hero-sub">
            From hackathons to workshops - relive moments that shaped the community.
          </p>
        </div>

        {/* Scroll indicator removed as per requirements */}
      </section>

      {/* ── Main Section ── */}
      <main className="ev-main">
        {isLoading ? (
          <div className="ev-loading">
            <div className="ev-spinner-ring" />
            <div className="ev-spinner-ring ev-spinner-ring--2" />
            <p className="ev-loading-text">Loading events timeline…</p>
          </div>
        ) : error ? (
          <div className="ev-error">
            <div className="ev-error-icon">⚡</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="ev-empty">
            <div className="ev-empty-orb" />
            <h3>No Events Yet</h3>
            <p>Stay tuned! Console Club events will appear here.</p>
          </div>
        ) : (
          <>
            {/* Timeline Subheader */}
            <div className="ev-timeline-intro">
              {/* OUR JOURNEY tag removed; timeline heading and description updated */}
              <h2 className="ev-intro-title">Timeline of Our Journey</h2>
              <p className="ev-intro-subtitle">
                Travel with us through time - story of Console, told one event at a time.
              </p>
            </div>

            {/* Live Filter Search bar */}
            <SearchBar query={query} onQuery={setQuery} />

            {filtered.length === 0 ? (
              <div className="ev-no-results">
                <p>No events match <strong>"{query}"</strong></p>
                <button className="ev-clear-filter" onClick={() => setQuery("")}>Clear search</button>
              </div>
            ) : (
              <>
                {query && (
                  <p className="ev-results-count">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{query}"
                  </p>
                )}

                {/* Vertical Timeline List */}
                <div className="ev-timeline-list">
                  <div className="ev-timeline-line" />
                  {filtered.map((event, i) => (
                    <TimelineItem
                      key={event.id}
                      event={event}
                      index={i}
                      onImageClick={openLightbox}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Community / Join section removed as per requirements */}

      {/* ── Lightbox Overlay ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.startIndex}
          onClose={closeLightbox}
        />
      )}

      {/* ── Back to Top ── */}
      <BackToTop />
    </div>
  );
}
