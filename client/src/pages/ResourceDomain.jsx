import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roadmapsData } from "../data/roadmapsData";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import {
  ArrowLeft, CheckCircle2, Circle, ChevronDown,
  PlayCircle, BookOpen, FlaskConical, Flag,
  Wrench, ExternalLink, Zap
} from "lucide-react";
import "./Resources.css";

// ── Circular progress ring ────────────────────────────────────────
function ProgressRing({ percent, color, done, total }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="rd-ring-wrap">
      <svg className="rd-ring-svg" viewBox="0 0 128 128" fill="none">
        {/* Track */}
        <circle cx="64" cy="64" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        {/* Progress */}
        <motion.circle
          cx="64" cy="64" r={r}
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          filter={`drop-shadow(0 0 8px ${color})`}
        />
      </svg>
      <div className="rd-ring-inner">
        <span className="rd-ring-done" style={{ color }}>{done}</span>
        <span className="rd-ring-sep">/ {total}</span>
        <span className="rd-ring-pct">{percent}%</span>
      </div>
    </div>
  );
}

// ── Animated spine line ───────────────────────────────────────────
function SpineLine({ progress, color }) {
  return (
    <div className="rd-spine-track">
      <motion.div
        className="rd-spine-fill"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress / 100 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
    </div>
  );
}

// ── Module node ───────────────────────────────────────────────────
function ModuleNode({ done, id, color, onClick }) {
  return (
    <motion.button
      className={`rd-node ${done ? "done" : ""}`}
      style={done ? { background: color, borderColor: color, boxShadow: `0 0 16px ${color}60` } : { "--tc": color }}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      title={done ? "Mark incomplete" : "Mark complete"}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <CheckCircle2 size={20} color="#fff" />
          </motion.span>
        ) : (
          <motion.span
            key="num"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="rd-node-num"
          >
            {id}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Module card ───────────────────────────────────────────────────
function ModuleCard({ mod, done, color, onToggle, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={`rd-step ${done ? "done" : ""}`}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Node */}
      <ModuleNode
        done={done}
        id={mod.id}
        color={color}
        onClick={onToggle}
      />

      {/* Card */}
      <div
        className={`rd-card ${open ? "open" : ""}`}
        style={{ "--tc": color }}
      >
        {/* Card header — always visible, click to expand */}
        <button
          className="rd-card-head"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
        >
          <div className="rd-card-head-left">
            <span className="rd-mod-index">Module {mod.id}</span>
            <h3 className="rd-mod-title">{mod.title}</h3>
          </div>
          <motion.span
            className="rd-card-chevron"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>

        {/* Card body — animated expand/collapse */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              className="rd-card-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="rd-card-body-inner">
                {/* Learn */}
                <div className="rd-section">
                  <div className="rd-section-label">
                    <Zap size={12} />
                    <span>Learn</span>
                  </div>
                  <ul className="rd-learn-list">
                    {mod.learn.map((pt, i) => (
                      <li key={i}>
                        <span className="rd-learn-bullet" style={{ color }} />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Resources */}
                <div className="rd-section">
                  <div className="rd-section-label">
                    <BookOpen size={12} />
                    <span>Resources</span>
                  </div>
                  <div className="rd-res-list">
                    {mod.videos.map((v, i) => (
                      <a
                        key={`v-${i}`}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rd-res-row rd-res-video"
                      >
                        <span className="rd-res-badge">
                          <PlayCircle size={11} /> Video
                        </span>
                        <span className="rd-res-text">{v.text}</span>
                        <ExternalLink size={11} className="rd-res-ext" />
                      </a>
                    ))}
                    {mod.readings.map((r, i) => (
                      <a
                        key={`r-${i}`}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rd-res-row rd-res-read"
                      >
                        <span className="rd-res-badge">
                          <BookOpen size={11} /> Read
                        </span>
                        <span className="rd-res-text">{r.text}</span>
                        <ExternalLink size={11} className="rd-res-ext" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Practice */}
                <div className="rd-section">
                  <div className="rd-section-label">
                    <FlaskConical size={12} />
                    <span>Practice</span>
                  </div>
                  <div className="rd-practice-box">
                    <p className="rd-practice-text">{mod.practice}</p>
                  </div>
                </div>

                {/* Checkpoint */}
                <div className="rd-checkpoint">
                  <div className="rd-checkpoint-label">
                    <Flag size={11} />
                    <span>Move on when</span>
                  </div>
                  <p className="rd-checkpoint-text">{mod.checkpoint}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function ResourceDomain() {
  const { domain: domainId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const track = roadmapsData[domainId];
  const heroRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!track) navigate("/resources");
  }, [track, navigate]);

  // Progress
  const [completedModules, setCompletedModules] = useState({});

  useEffect(() => {
    if (track) {
      const saved = {};
      track.modules.forEach(mod => {
        saved[mod.id] = localStorage.getItem(`rp-${track.id}-${mod.id}`) === "true";
      });
      setCompletedModules(saved);
    }
  }, [track]);

  // Hero entrance
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(
      heroRef.current.querySelectorAll(".rd-hero-animate"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.1 }
    );
  }, [track]);

  if (!track) return null;

  const totalModules = track.modules.length;
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const toggleModule = modId => {
    const next = !completedModules[modId];
    setCompletedModules(prev => ({ ...prev, [modId]: next }));
    localStorage.setItem(`rp-${track.id}-${modId}`, String(next));
  };

  return (
    <div className="res-page" style={{ "--track-color": track.color }}>
      {/* Background */}
      <div className="rd-bg">
        <div className="rd-bg-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${track.color}14 0%, transparent 65%)` }} />
        <div className="res-grid-lines rd-grid-subtle" />
      </div>

      <div className="res-layout">
        {/* Back */}
        <div className="rd-hero-animate">
          <button
            className="rd-back-btn"
            onClick={() => navigate("/resources")}
          >
            <ArrowLeft size={15} /> All Tracks
          </button>
        </div>

        {/* Hero header */}
        <header ref={heroRef} className="rd-header">
          <div className="rd-header-inner">
            {/* Left: title + intro */}
            <div className="rd-header-left">
              <div className="rd-hero-animate rd-track-badge" style={{ borderColor: `${track.color}40`, color: track.color, background: `${track.color}10` }}>
                {track.id.toUpperCase()}
              </div>
              <h1 className="rd-hero-animate rd-title">{track.title}</h1>
              <p className="rd-hero-animate rd-intro">{track.intro}</p>
            </div>

            {/* Right: progress ring */}
            <div className="rd-hero-animate rd-header-right">
              <ProgressRing
                percent={progressPercent}
                color={track.color}
                done={completedCount}
                total={totalModules}
              />
              <p className="rd-ring-hint">Click modules to track progress</p>
            </div>
          </div>

          {/* Info strip */}
          <div className="rd-hero-animate rd-info-strip">
            <div className="rd-info-row">
              <div className="rd-info-key">
                <Wrench size={11} /> Tools
              </div>
              <span className="rd-info-val">{track.generalTools}</span>
            </div>
            <div className="rd-info-divider" />
            <div className="rd-info-row">
              <div className="rd-info-key">
                <BookOpen size={11} /> Reading
              </div>
              <span className="rd-info-val rd-reading-links">
                {track.preferReading.map((item, i) => (
                  <span key={i}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rd-reading-link"
                      title={item.desc}
                    >
                      {item.label}
                    </a>
                    {i < track.preferReading.length - 1 && (
                      <span className="rd-link-sep"> · </span>
                    )}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </header>

        {/* Timeline */}
        <section className="rd-timeline">
          <SpineLine progress={progressPercent} color={track.color} />

          {track.modules.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              done={!!completedModules[mod.id]}
              color={track.color}
              onToggle={() => toggleModule(mod.id)}
              defaultOpen={i === 0}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
