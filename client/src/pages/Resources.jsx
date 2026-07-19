import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { roadmapsData } from "../data/roadmapsData";
import { motion, useInView } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu, Trophy, GitBranch, Globe, Smartphone, Brain,
  ArrowRight, Layers, ChevronRight, Zap
} from "lucide-react";
import "./Resources.css";

gsap.registerPlugin(ScrollTrigger);

const TRACK_ICONS = {
  cpp: Cpu,
  cp: Trophy,
  dsa: GitBranch,
  webdev: Globe,
  appdev: Smartphone,
  aiml: Brain,
};

const TRACK_DESCRIPTIONS = {
  cpp: "Low-level mastery: memory, performance, and modern idioms.",
  cp: "From rating 0 to Codeforces competitive in structured sprints.",
  dsa: "Interview-crushing algorithms via Striver's battle-tested sheets.",
  webdev: "HTML to full-stack React/Node, everything live on the web.",
  appdev: "Cross-platform mobile apps from setup to Play Store.",
  aiml: "Python to production ML: stats, sklearn, deep learning, GenAI.",
};

const totalModules = Object.values(roadmapsData).reduce(
  (acc, t) => acc + t.modules.length, 0
);

// ── Animated grid background ──────────────────────────────────────
function GridBg() {
  return (
    <div className="res-grid-bg" aria-hidden="true">
      <div className="res-grid-lines" />
      <div className="res-grid-glow res-grid-glow-1" />
      <div className="res-grid-glow res-grid-glow-2" />
      <div className="res-grid-glow res-grid-glow-3" />
    </div>
  );
}

// ── Floating orbs ─────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="res-orbs" aria-hidden="true">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`res-orb res-orb-${i + 1}`} />
      ))}
    </div>
  );
}

// ── Track card ────────────────────────────────────────────────────
function TrackCard({ track, index, onClick }) {
  const Icon = TRACK_ICONS[track.id] || Layers;
  const desc = TRACK_DESCRIPTIONS[track.id] || track.description;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable={true}
        glareMaxOpacity={0.06}
        glareColor={track.color}
        glarePosition="all"
        glareBorderRadius="20px"
        scale={1.02}
        transitionSpeed={400}
        style={{ transformStyle: "preserve-3d" }}
      >
        <button
          className="res-card"
          style={{ "--tc": track.color }}
          onClick={onClick}
          aria-label={`Open ${track.title} roadmap`}
        >
          {/* Scanline overlay */}
          <div className="res-card-scanline" />

          {/* Glow ring */}
          <div className="res-card-glow-ring" />

          {/* Terminal header */}
          <div className="res-card-term-bar">
            <div className="res-card-dots">
              <span /><span /><span />
            </div>
            <span className="res-card-term-label">
              ~/console/resources/{track.id}
            </span>
            <ChevronRight size={12} className="res-card-term-chevron" />
          </div>

          {/* Body */}
          <div className="res-card-body">
            {/* Index + Icon */}
            <div className="res-card-top">
              <span className="res-card-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="res-card-icon-wrap">
                <Icon size={22} className="res-card-icon" />
              </div>
            </div>

            {/* Title + sub */}
            <div className="res-card-titles">
              <h3 className="res-card-name">{track.title}</h3>
              <p className="res-card-sub">{track.subtitle}</p>
            </div>

            {/* Description */}
            <p className="res-card-desc">{desc}</p>

            {/* Footer */}
            <div className="res-card-footer">
              <span className="res-card-scope">{track.scope}</span>
              <span className="res-card-cta">
                Explore <ArrowRight size={13} />
              </span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="res-card-accent-line" />
        </button>
      </Tilt>
    </motion.div>
  );
}

// ── Hero section ──────────────────────────────────────────────────
function Hero({ tracks }) {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, skewY: 3 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.9, ease: "power3.out" }
    ).fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
    return () => tl.kill();
  }, []);

  return (
    <header className="res-hero">
      <div ref={titleRef} className="res-hero-title-wrap">
        <h1 className="res-hero-title res-hero-title-centered">
          <span className="res-hero-title-line res-hero-title-gradient">Resource Hub</span>
        </h1>
      </div>
      <div ref={subtitleRef} className="res-hero-sub-wrap res-hero-sub-wrap-centered">
        <p className="res-hero-subtitle">
          Structured, module-by-module roadmaps built from the best free
          resources on the internet. Each track follows a fixed progression,
          no filler, no fluff.
        </p>
      </div>
    </header>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function Resources() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const tracks = Object.values(roadmapsData);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  return (
    <div className="res-page">
      <GridBg />
      <FloatingOrbs />

      <div className="res-layout">
        <Hero tracks={tracks} />

        {/* Track grid */}
        <section className="res-grid-section">
          <div className="res-grid">
            {tracks.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                index={i}
                onClick={() => navigate(`/resources/${track.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
