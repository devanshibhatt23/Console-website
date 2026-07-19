import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getPOTD } from "../services/problemService";
import { addComment, getComments } from "../services/commentService";
import { supabase } from "../lib/supabase.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import gsap from "gsap";
import GridGlow from "@/components/sections/GridGlow";
import {
  Zap, Trophy, ExternalLink, Clock, ChevronLeft, ChevronRight,
  ChevronDown, Send, MessageSquare, Activity, Target, Crown,
  Award, Code2, Cpu, AlertTriangle, Flame, Copy, Check, Smile,
} from "lucide-react";
import "./DashboardPOTD.css";

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
function getDailyFallbackId() {
  const dateStr = new Date().toISOString().split("T")[0];
  const parts = dateStr.split("-");
  const year = parseInt(parts[0]).toString(16).padStart(8, "0");
  const month = parseInt(parts[1]).toString(16).padStart(4, "0");
  const day = parseInt(parts[2]).toString(16).padStart(12, "0");
  return `${year}-0000-${month}-0000-${day}`;
}

function getInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "U";
}

// ═══════════════════════════════════════════════════════════════════
// PARTICLES CONFIG — matching landing page, with grab-on-hover
// ═══════════════════════════════════════════════════════════════════
const PARTICLES_OPTIONS = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: true, mode: "grab" }, resize: { enable: true } },
    modes: { grab: { distance: 140, links: { opacity: 0.5 } } },
  },
  particles: {
    color: { value: "#F2994A" },
    links: { color: "#F0405C", distance: 150, enable: true, opacity: 0.12, width: 1 },
    move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 0.5, straight: false },
    number: { density: { enable: true, width: 800 }, value: 45 },
    opacity: { value: 0.2 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 2 } },
  },
  detectRetina: true,
};

// ═══════════════════════════════════════════════════════════════════
// CURSOR-TRACKED SPOTLIGHT HOOK
// ═══════════════════════════════════════════════════════════════════
function useSpotlight() {
  const spotRef = useRef(null);
  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;
    const onMove = (e) => {
      el.style.setProperty("--mouse-x", `${e.clientX}px`);
      el.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return spotRef;
}

// ═══════════════════════════════════════════════════════════════════
// TINY UI ATOMS
// ═══════════════════════════════════════════════════════════════════
function LiveDot({ color = "emerald" }) {
  const colors = { emerald: "bg-emerald-400", orange: "bg-orange-400", indigo: "bg-indigo-400" };
  return (
    <span className="relative flex h-2 w-2">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[color]}`} />
    </span>
  );
}

function SectionDivider({ icon, label }) {
  return (
    <div className="flex items-center gap-4 mb-14">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
        {icon}
        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.22em] font-montserrat">{label}</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  if (!difficulty) return null;
  const d = difficulty.toLowerCase();
  const cfg = {
    easy: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_14px_rgba(52,211,153,0.12)]", dot: "bg-emerald-400" },
    medium: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_14px_rgba(251,191,36,0.12)]", dot: "bg-amber-400" },
    hard: { cls: "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_14px_rgba(248,113,113,0.12)]", dot: "bg-red-400" },
  };
  const c = cfg[d] || { cls: "bg-white/6 text-white/50 border-white/10", dot: "bg-white/50" };
  return (
    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase ${c.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{difficulty}
    </span>
  );
}

function PlatformBadge({ url }) {
  if (!url) return null;
  if (url.includes("leetcode")) return <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#FFA116]/10 text-[#FFA116] border border-[#FFA116]/20"><Cpu size={10} /> LeetCode</span>;
  if (url.includes("codeforces")) return <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"><Cpu size={10} /> Codeforces</span>;
  if (url.includes("codechef")) return <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-700/10 text-amber-500 border border-amber-700/20"><Cpu size={10} /> CodeChef</span>;
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// TYPEWRITER — character-by-character subtitle reveal
// ═══════════════════════════════════════════════════════════════════
function TypewriterText({ text, highlightFrom, delay = 900 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, 35);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  const before = highlightFrom ? displayed.slice(0, Math.min(displayed.length, highlightFrom)) : displayed;
  const after = highlightFrom && displayed.length > highlightFrom ? displayed.slice(highlightFrom) : "";
  return (
    <span>
      <span className="text-white/40">{before}</span>
      {after && <span className="text-gradient-brand">{after}</span>}
      {!done && <span className="potd-typewriter-cursor" />}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COUNTDOWN TIMER
// ═══════════════════════════════════════════════════════════════════
function CountdownTimer({ compact = false }) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date(); const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight - now);
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  if (compact) return `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`;
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <Clock size={13} className="text-orange-400/70 flex-shrink-0" />
      <span className="text-white/40">
        <span className="text-white/70 tabular-nums">{pad(t.h)}</span><span className="text-white/20 mx-0.5">:</span>
        <span className="text-white/70 tabular-nums">{pad(t.m)}</span><span className="text-white/20 mx-0.5">:</span>
        <span className="text-white/70 tabular-nums">{pad(t.s)}</span>
        <span className="ml-2 text-white/25 text-xs">remaining</span>
      </span>
    </div>
  );
}

function MedalIcon({ rank }) {
  if (rank === 1) return <Crown size={16} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />;
  if (rank === 2) return <Trophy size={15} className="text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.4)]" />;
  if (rank === 3) return <Award size={15} className="text-amber-600 drop-shadow-[0_0_6px_rgba(217,119,6,0.4)]" />;
  return <span className="text-xs font-mono text-white/30 w-4 inline-block text-center">{rank}</span>;
}

// ═══════════════════════════════════════════════════════════════════
// COUNT-UP ANIMATION
// ═══════════════════════════════════════════════════════════════════
function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current || target === 0) { setVal(target); return; }
    ref.current = true;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val}</>;
}

function StatCard({ icon, value, label, valueColor = "text-white/90" }) {
  return (
    <motion.div className="potd-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="potd-stat-icon">{icon}</div>
      <div className="flex flex-col">
        <span className={`potd-stat-value ${valueColor}`}>{typeof value === "number" ? <CountUp target={value} /> : value}</span>
        <span className="potd-stat-label text-white/30">{label}</span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SKELETON / EMPTY STATES
// ═══════════════════════════════════════════════════════════════════
function HeroSkeleton() {
  return (
    <div className="w-full rounded-2xl border border-white/6 bg-white/[0.015] p-8 md:p-10">
      <div className="flex gap-2.5 mb-7 animate-pulse"><div className="h-6 w-24 rounded-full bg-white/6" /><div className="h-6 w-16 rounded-full bg-white/6" /><div className="ml-auto h-6 w-20 rounded-full bg-white/4" /></div>
      <div className="h-9 w-3/5 rounded-xl bg-white/6 mb-7 animate-pulse" />
      <div className="space-y-3 animate-pulse">{[1, .92, .97, .85, .9].map((w, i) => <div key={i} className="h-4 rounded-lg bg-white/4" style={{ width: `${w * 100}%` }} />)}</div>
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5 animate-pulse"><div className="h-5 w-40 rounded bg-white/5" /><div className="h-11 w-36 rounded-xl bg-white/6" /></div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return <div className="space-y-1.5">{[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse"><div className="w-6 h-5 rounded bg-white/6" /><div className="w-8 h-8 rounded-full bg-white/6" /><div className="flex-1 h-4 rounded-lg bg-white/5" style={{ width: `${55 + i * 8}%` }} /></div>)}</div>;
}

function EmptyState() {
  const [dots, setDots] = useState("_");
  useEffect(() => { const iv = setInterval(() => setDots(d => d.length >= 3 ? "_" : d + "_"), 600); return () => clearInterval(iv); }, []);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full rounded-2xl border border-white/6 bg-white/[0.015] p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/8 flex items-center justify-center mx-auto mb-5"><Code2 size={28} className="text-white/18" /></div>
      <h3 className="text-xl font-bold text-white/35 mb-2 font-montserrat">No challenge today</h3>
      <p className="text-white/22 text-sm mb-5">No POTD has been published yet. Check back soon.</p>
      <span className="font-mono text-xs text-white/15">$ waiting{dots}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SOLVE BUTTON — magnetic hover
// ═══════════════════════════════════════════════════════════════════
function SolveButton({ url }) {
  const btnRef = useRef(null);
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = btnRef.current?.getBoundingClientRect(); if (!r) return;
    setMag({ x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.22 });
  };
  return (
    <motion.a ref={btnRef} href={url || "#"} target="_blank" rel="noreferrer"
      animate={{ x: mag.x, y: mag.y }} transition={{ type: "spring", stiffness: 350, damping: 28 }}
      onMouseMove={onMove} onMouseLeave={() => setMag({ x: 0, y: 0 })}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2.5 px-7 py-3 rounded-xl font-bold text-sm text-white select-none"
      style={{ background: "linear-gradient(135deg, #F2994A 0%, #F0405C 100%)", boxShadow: "0 0 24px rgba(242,153,74,0.3), 0 0 48px rgba(240,64,92,0.15)", willChange: "transform" }}>
      <Zap size={14} />Solve Now<ExternalLink size={13} />
    </motion.a>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COPY LINK BUTTON
// ═══════════════════════════════════════════════════════════════════
function CopyLinkButton({ url }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => { try { await navigator.clipboard.writeText(url || window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {} };
  return (
    <motion.button onClick={handleCopy} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
      className="potd-copy-btn flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-sm text-white/55 hover:text-white/80 bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] transition-all">
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy Link"}
      <AnimatePresence>{copied && <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="potd-copy-tooltip">Link copied to clipboard</motion.span>}</AnimatePresence>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PROBLEM CARD (Tilt + animated border + shimmer)
// ═══════════════════════════════════════════════════════════════════
function ProblemCard({ potd, platformDesc, loadingPlatformDesc }) {
  return (
    <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.03} glareColor="#F2994A" glarePosition="all" glareBorderRadius="20px" transitionSpeed={2000} scale={1.006} className="w-full" style={{ willChange: "transform" }}>
      <div className="potd-animated-border-wrap rounded-[20px] p-px">
        <div className="relative rounded-[20px] overflow-hidden bg-[#060610] potd-shimmer-wrap">
          <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-2 flex-wrap"><PlatformBadge url={potd.solution} /><DifficultyBadge difficulty={potd.difficulty} /></div>
              <span className="text-[11px] font-mono text-white/22 bg-white/[0.03] border border-white/6 px-3 py-1.5 rounded-full">{potd.date || "Today"}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-8 tracking-tight font-montserrat">{potd.title}</h2>
            <div className="potd-desc-viewport custom-scrollbar relative mb-8" style={{ maxHeight: "320px", overflowY: "auto", paddingRight: "8px" }}>
              {loadingPlatformDesc ? (
                <div className="space-y-3 animate-pulse">{[1,.9,.95,.88,.93,.85].map((w, i) => <div key={i} className="h-3.5 rounded bg-white/5" style={{ width: `${w*100}%` }} />)}</div>
              ) : platformDesc?.content ? (
                <div className={`potd-platform-desc ${platformDesc.platform === "leetcode" ? "potd-platform-desc--lc" : "potd-platform-desc--cf"}`} dangerouslySetInnerHTML={{ __html: platformDesc.content }} />
              ) : (
                <p className="text-white/55 text-sm leading-relaxed whitespace-pre-wrap">{potd.description || "Solve this algorithmic challenge. Click below to view the full problem statement on the platform."}</p>
              )}
            </div>
            {potd.topics?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {potd.topics.map((topic, i) => <span key={i} className="text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-500/7 border border-indigo-500/12 text-indigo-400/75 hover:bg-indigo-500/12 hover:text-indigo-300 transition-all cursor-default">{topic}</span>)}
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-7">
              <CountdownTimer />
              <div className="flex items-center gap-3"><CopyLinkButton url={potd.solution} /><SolveButton url={potd.solution} /></div>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PODIUM — top-3 highlight
// ═══════════════════════════════════════════════════════════════════
function Podium({ rows, showScore }) {
  if (!rows || rows.length < 1) return null;
  const top3 = rows.slice(0, 3);
  const ordered = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3.length === 2 ? [top3[1], top3[0]] : [top3[0]];
  const styles = {
    0: { cls: "potd-podium-card--gold", bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", glow: "0 0 22px rgba(250,204,21,0.35)" },
    1: { cls: "potd-podium-card--silver", bg: "linear-gradient(135deg, #94a3b8, #64748b)", glow: "0 0 14px rgba(148,163,184,0.2)" },
    2: { cls: "potd-podium-card--bronze", bg: "linear-gradient(135deg, #d97706, #b45309)", glow: "0 0 14px rgba(217,119,6,0.2)" },
  };
  return (
    <motion.div className="potd-podium" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {ordered.map((row, i) => {
        const origRank = top3.indexOf(row);
        const s = styles[origRank] || styles[2];
        const Wrapper = row.id ? Link : "div";
        const props = row.id ? { to: `/profile/${row.id}` } : {};
        return (
          <motion.div key={row.id || i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.45 }} className={`potd-podium-card ${s.cls}`}>
            <Wrapper {...props} className="flex flex-col items-center gap-2 w-full" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="relative">
                <div className="potd-podium-avatar" style={{ background: s.bg, boxShadow: s.glow }}>{getInitials(row.name)}</div>
                <div className="absolute -top-1.5 -right-1.5"><MedalIcon rank={origRank + 1} /></div>
              </div>
              <span className="potd-podium-name">{row.name || "Anonymous"}</span>
              {showScore && <span className={`potd-podium-score ${origRank === 0 ? "text-yellow-400" : origRank === 1 ? "text-slate-300" : "text-amber-500"}`}>{(row.score || 0).toLocaleString()} <span className="text-white/20 text-[10px]">pts</span></span>}
            </Wrapper>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ARENA CARD (leaderboard panel with podium)
// ═══════════════════════════════════════════════════════════════════
const MINI_PAGE_SIZE = 8;

function ArenaCard({ title, icon, badge, rows, loading, showScore, scoreLabel, emptyText }) {
  const [page, setPage] = useState(1);
  const remaining = rows.slice(3);
  const totalPages = Math.max(1, Math.ceil(remaining.length / MINI_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = remaining.slice((safePage - 1) * MINI_PAGE_SIZE, safePage * MINI_PAGE_SIZE);
  const isLive = badge === "live";

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#060610]/90 backdrop-blur-xl"
      style={{ boxShadow: "0 0 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: isLive ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.35), transparent)" : "linear-gradient(90deg, transparent, rgba(242,153,74,0.3), transparent)" }} />
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">{icon}<h3 className="font-bold text-white/70 text-base tracking-tight font-montserrat">{title}</h3></div>
          {isLive
            ? <span className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-emerald-400 bg-emerald-400/7 border border-emerald-400/18 px-2.5 py-1 rounded-full tracking-widest uppercase"><LiveDot color="emerald" /> Live</span>
            : <span className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400/65 bg-yellow-400/5 border border-yellow-400/12 px-2.5 py-1 rounded-full uppercase tracking-widest"><Flame size={10} /> All Time</span>}
        </div>
        {loading ? <LeaderboardSkeleton /> : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/6 flex items-center justify-center mb-3">{isLive ? <Target size={18} className="text-white/20" /> : <Trophy size={18} className="text-white/20" />}</div>
            <p className="text-white/22 text-sm max-w-52 leading-relaxed">{emptyText}</p>
          </div>
        ) : (
          <>
            <Podium rows={rows.slice(0, 3)} showScore={showScore} />
            {remaining.length > 0 && (
              <div className="space-y-0.5 mt-2">
                <AnimatePresence>
                  {pageRows.map((row, index) => {
                    const rank = 3 + (safePage - 1) * MINI_PAGE_SIZE + index + 1;
                    const content = (
                      <motion.div key={`${row.id || index}-${rank}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03, duration: 0.3 }}
                        className="potd-arena-row flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.035] transition-colors duration-150 group cursor-pointer">
                        <div className="w-6 flex items-center justify-center flex-shrink-0"><MedalIcon rank={rank} /></div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b, #3730a3)" }}>{getInitials(row.name)}</div>
                        <span className="flex-1 text-sm text-white/55 group-hover:text-white/85 transition-colors truncate font-medium">{row.name || "Anonymous"}</span>
                        {showScore && <span className="text-sm font-bold font-mono text-orange-400/75 flex-shrink-0">{(row.score || 0).toLocaleString()}<span className="text-white/20 text-[10px] ml-1">pts</span></span>}
                      </motion.div>
                    );
                    return row.id ? <Link key={`${row.id}-${index}`} to={`/profile/${row.id}`} className="block">{content}</Link> : <div key={index}>{content}</div>;
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
        {!loading && remaining.length > MINI_PAGE_SIZE && totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.05]">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="p-1.5 rounded-lg hover:bg-white/6 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={14} className="text-white/45" /></button>
            <span className="text-[10px] font-mono text-white/20 tabular-nums">{safePage} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="p-1.5 rounded-lg hover:bg-white/6 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"><ChevronRight size={14} className="text-white/45" /></button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CHAT NEXUS — realtime discussion
// ═══════════════════════════════════════════════════════════════════
function ChatNexus({ comments, user, profile, newCommentText, onCommentChange, onSubmit, addingComment, chatViewportRef, chatEndRef }) {
  const isTyping = newCommentText.trim().length > 0;
  const textareaRef = useRef(null);
  const handleInput = (e) => { onCommentChange(e.target.value); const el = e.target; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; };
  const handleKeyDown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); if (newCommentText.trim()) { onSubmit(e); if (textareaRef.current) textareaRef.current.style.height = "auto"; } } };

  return (
    <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[20px] overflow-hidden border border-white/[0.06] bg-[#060610]/90 backdrop-blur-xl"
      style={{ boxShadow: "0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 md:px-7 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={15} className="text-indigo-400" />
          <h3 className="font-bold text-white/70 text-base tracking-tight font-montserrat">Discussion</h3>
          {comments.length > 0 && <span className="text-[10px] font-mono text-white/25 bg-white/[0.03] px-2 py-0.5 rounded-full">{comments.length}</span>}
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-indigo-400/75 bg-indigo-400/5 border border-indigo-400/12 px-2.5 py-1 rounded-full uppercase tracking-widest"><LiveDot color="indigo" />Realtime</span>
      </div>

      {/* Warning */}
      <div className="mx-6 md:mx-7 mt-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/[0.04] border border-red-500/[0.1]">
        <AlertTriangle size={13} className="text-red-400/60 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-400/55 leading-relaxed"><strong className="text-red-400/75">Community Guidelines:</strong> Keep it respectful and technical. Inappropriate messages result in a permanent ban.</p>
      </div>

      {/* Messages */}
      <div ref={chatViewportRef} className="flex flex-col gap-4 px-6 md:px-7 py-6 overflow-y-auto custom-scrollbar" style={{ minHeight: "260px", maxHeight: "420px" }}>
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/12 flex items-center justify-center mb-4"><MessageSquare size={22} className="text-indigo-400/35" /></div>
            <p className="text-white/28 text-sm font-medium">No messages yet</p>
            <p className="text-white/18 text-xs mt-1.5">Share your approach, hints, or time complexity!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {comments.map((cmt) => {
              const isOwner = cmt.user_id === user?.id;
              return (
                <motion.div key={cmt.id} initial={{ opacity: 0, y: 14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }}
                  className={`potd-chat-msg flex items-end gap-2.5 ${isOwner ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white mb-0.5"
                    style={{ background: isOwner ? "linear-gradient(135deg, #F2994A, #F0405C)" : "linear-gradient(135deg, #1e1b4b, #4f46e5)", boxShadow: isOwner ? "0 0 14px rgba(242,153,74,0.2)" : "0 0 14px rgba(99,102,241,0.15)" }}>
                    {getInitials(cmt.profiles?.name)}
                  </div>
                  <div className="relative">
                    <div className="max-w-[72%] rounded-2xl px-4 py-3" style={{ background: isOwner ? "rgba(240,64,92,0.08)" : "rgba(99,102,241,0.07)", border: `1px solid ${isOwner ? "rgba(240,64,92,0.15)" : "rgba(99,102,241,0.13)"}` }}>
                      <div className={`flex items-baseline gap-2.5 mb-1.5 ${isOwner ? "flex-row-reverse" : ""}`}>
                        <Link to={`/profile/${cmt.user_id}`} className="text-xs font-bold text-white/70 hover:text-white/90 transition-colors truncate">{cmt.profiles?.name || "Anonymous coder"}</Link>
                        <span className="text-[10px] font-mono text-white/22 flex-shrink-0">{new Date(cmt.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed whitespace-pre-wrap break-words">{cmt.content}</p>
                    </div>
                    <button className={`potd-reaction-btn absolute -bottom-2 ${isOwner ? "left-1" : "right-1"} flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/8 text-xs text-white/35 hover:text-white/65 hover:bg-white/[0.08] transition-all`}
                      onClick={(e) => e.preventDefault()} title="React (coming soon)"><Smile size={11} /><span className="text-[10px]">👍</span></button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 md:px-7 pb-1">
            <div className="flex items-center gap-2 text-xs text-white/22"><div className="potd-typing-dots"><span /><span /><span /></div><span className="font-mono">typing...</span></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Composer */}
      <div className="px-6 md:px-7 py-4 border-t border-white/[0.05]">
        <form onSubmit={(e) => { onSubmit(e); if (textareaRef.current) textareaRef.current.style.height = "auto"; }} className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white mb-0.5" style={{ background: "linear-gradient(135deg, #F2994A, #F0405C)" }}>
            {getInitials(profile?.name || user?.user_metadata?.name || user?.email)}
          </div>
          <textarea ref={textareaRef} placeholder="Share your approach, hint, or O(n) notes..." value={newCommentText} onChange={handleInput} onKeyDown={handleKeyDown} disabled={addingComment} rows={1}
            className="potd-composer-input flex-1 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white/75 placeholder-white/18 outline-none transition-all duration-200 focus:border-indigo-500/35 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/15" />
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <motion.button type="submit" disabled={addingComment || !newCommentText.trim()} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}><Send size={14} className="text-white" /></motion.button>
            <span className="text-[9px] font-mono text-white/12 select-none">{navigator.platform?.includes("Mac") ? "⌘↵" : "Ctrl↵"}</span>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SCROLL CUE
// ═══════════════════════════════════════════════════════════════════
function ScrollCue() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
      className="potd-scroll-cue flex flex-col items-center gap-1.5 mt-12 cursor-pointer"
      onClick={() => document.getElementById("potd-arena-section")?.scrollIntoView({ behavior: "smooth" })}>
      <span className="text-[9px] font-mono text-white/18 uppercase tracking-[0.3em]">Scroll</span>
      <ChevronDown size={16} className="text-white/20" />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN POTD PAGE (inner)
// ═══════════════════════════════════════════════════════════════════
function POTDInner() {
  const { user, profile, loading } = useAuth();
  const spotlightRef = useSpotlight();

  // ── state ──
  const [potd, setPotd] = useState(null);
  const [loadingPOTD, setLoadingPOTD] = useState(true);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [potdLeaderboard, setPotdLeaderboard] = useState([]);
  const [todayRanking, setTodayRanking] = useState([]);
  const [loadingPotdLeaderboard, setLoadingPotdLeaderboard] = useState(true);
  const [loadingTodayRanking, setLoadingTodayRanking] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [platformDesc, setPlatformDesc] = useState(null);
  const [loadingPlatformDesc, setLoadingPlatformDesc] = useState(false);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);

  const chatEndRef = useRef(null);
  const chatViewportRef = useRef(null);
  const hasScrolledOnceRef = useRef(false);
  const heroRef = useRef(null);

  // ── Parallax on glow blobs ──
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 1000], [0, -130]);
  const blob2Y = useTransform(scrollY, [0, 1000], [0, 90]);
  const blob3Y = useTransform(scrollY, [0, 1000], [0, -70]);

  // ── GSAP hero entrance ──
  useEffect(() => {
    if (loadingPOTD || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-hero-item", { opacity: 0, y: 40, filter: "blur(10px)" }, {
        opacity: 1, y: 0, filter: "blur(0px)", stagger: 0.12, duration: 0.9, ease: "power3.out", clearProps: "filter",
      });
    }, heroRef);
    return () => ctx.revert();
  }, [loadingPOTD]);

  // ── Data effects (unchanged) ──
  useEffect(() => { loadPOTDDetails(); loadPotdLeaderboard(); }, [user]);
  useEffect(() => { if (potd?.id) loadTodayRanking(potd); }, [potd?.id]);
  useEffect(() => { if (potd?.solution) fetchPlatformDescription(potd.solution); }, [potd?.solution]);

  useEffect(() => {
    const targetId = potd ? potd.id : getDailyFallbackId();
    const channel = supabase.channel(`comments:${targetId}`).on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `target_id=eq.${targetId}` }, async () => { await loadComments(targetId); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [potd]);

  useEffect(() => {
    const channel = supabase.channel("submissions-realtime").on("postgres_changes", { event: "*", schema: "public", table: "submissions" }, async () => { if (potd) await loadTodayRanking(potd); await loadPotdLeaderboard(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [potd]);

  useEffect(() => {
    if (!hasScrolledOnceRef.current) { hasScrolledOnceRef.current = true; return; }
    const v = chatViewportRef.current; if (v) v.scrollTo({ top: v.scrollHeight, behavior: "smooth" });
  }, [comments]);

  // ── Handlers (unchanged) ──
  async function fetchPlatformDescription(url) {
    if (!url) return;
    try { setLoadingPlatformDesc(true); setPlatformDesc(null);
      const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5001" : "https://console-website.onrender.com";
      const r = await fetch(`${apiBase}/api/problem-description?url=${encodeURIComponent(url)}`); if (!r.ok) throw new Error(); setPlatformDesc(await r.json());
    } catch (e) { setPlatformDesc(null); } finally { setLoadingPlatformDesc(false); }
  }
  async function loadPOTDDetails() {
    try { setLoadingPOTD(true); const p = await getPOTD(); setPotd(p); if (!p) setLoadingTodayRanking(false); await loadComments(p ? p.id : getDailyFallbackId());
    } catch (e) { console.error("Error loading POTD:", e.message); } finally { setLoadingPOTD(false); }
  }
  async function loadComments(id) { try { setComments(await getComments(id) || []); } catch {} }
  async function loadPotdLeaderboard() {
    try { setLoadingPotdLeaderboard(true);
      const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5001" : "https://console-website.onrender.com";
      const r = await fetch(`${apiBase}/api/potd/leaderboard-live`); if (!r.ok) throw new Error();
      setPotdLeaderboard((await r.json() || []).filter(u => (typeof u?.name === "string" && u.name.trim()) || (typeof u?.handle_cf === "string" && u.handle_cf.trim()) || (typeof u?.handle_lc === "string" && u.handle_lc.trim())));
    } catch { setPotdLeaderboard([]); } finally { setLoadingPotdLeaderboard(false); }
  }
  async function loadTodayRanking(problem) {
    if (!problem?.id) return;
    try { setLoadingTodayRanking(true);
      const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:5001" : "https://console-website.onrender.com";
      const r = await fetch(`${apiBase}/api/potd/today-ranking?problemId=${encodeURIComponent(problem.id)}`); if (!r.ok) throw new Error();
      setTodayRanking((await r.json() || []).map(r => ({ user_id: r.user_id, name: r.name || "Anonymous coder" })));
    } catch { setTodayRanking([]); } finally { setLoadingTodayRanking(false); }
  }
  async function handleAddComment(e) {
    e.preventDefault(); if (!newCommentText.trim()) return; setAddingComment(true); setErrorMsg("");
    const id = potd ? potd.id : getDailyFallbackId();
    try { await addComment(user.id, id, newCommentText.trim()); setNewCommentText(""); await loadComments(id); } catch (e) { setErrorMsg("Failed to post: " + e.message); } finally { setAddingComment(false); }
  }

  // ── Derived data ──
  const todayRows = useMemo(() => todayRanking.map(r => ({ id: r.user_id, name: r.name })), [todayRanking]);
  const pointsRows = useMemo(() => potdLeaderboard.map(r => ({ id: r.id, name: r.name, score: r.score || 0 })), [potdLeaderboard]);
  const subtitleFull = "Your daily challenge, crafted to push limits.";
  const highlightStart = subtitleFull.indexOf("push limits.");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.4, repeat: Infinity }} className="font-mono text-sm text-white/35">Initializing console...</motion.div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Noise texture */}
      <div className="potd-noise" />
      {/* Cursor-tracked spotlight */}
      <div ref={spotlightRef} className="potd-spotlight" />

      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
        {/* GridGlow background (matching landing page) */}
        <GridGlow />

        {/* Particles */}
        <div className="absolute inset-0 z-0">
          <Particles id="potd-particles" className="w-full h-full" options={PARTICLES_OPTIONS} />
        </div>

        {/* Ambient glow blobs with parallax */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div style={{ y: blob1Y }} className="absolute top-1/3 left-1/4 w-[550px] h-[550px] rounded-full bg-indigo-700/6 blur-[150px] -translate-x-1/2 -translate-y-1/2" />
          <motion.div style={{ y: blob2Y }} className="absolute bottom-1/3 right-1/4 w-[550px] h-[550px] rounded-full bg-orange-600/5 blur-[150px] translate-x-1/2 translate-y-1/2" />
          <motion.div style={{ y: blob3Y }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-pink-600/4 blur-[110px]" />
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)" }} />

        {/* Hero content */}
        <div ref={heroRef} className="relative z-10 w-full px-6 flex flex-col items-center gap-8 potd-container">
          {/* Live badge */}
          <div className="gsap-hero-item flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-[11px] font-mono text-white/40 uppercase tracking-[0.2em] backdrop-blur-sm">
            <LiveDot color="orange" />Console · Problem of the Day
          </div>

          {/* Giant POTD heading */}
          <div className="gsap-hero-item text-center select-none">
            <h1
              className="font-montserrat leading-none cursor-default potd-heading-glow"
              style={{
                fontSize: "clamp(72px, 12vw, 128px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-5px",
                background: "linear-gradient(90deg, #F2994A, #F0405C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
              onMouseEnter={() => setIsHoveringTitle(true)}
              onMouseLeave={() => setIsHoveringTitle(false)}
            >
              POTD
            </h1>
            {/* Glow orb behind title on hover */}
            <div className="absolute inset-0 -z-10 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none" style={{
              background: "radial-gradient(ellipse at center, rgba(242,153,74,0.2) 0%, rgba(240,64,92,0.12) 50%, transparent 70%)",
              opacity: isHoveringTitle ? 1 : 0,
            }} />
            <p className="mt-4 text-base md:text-lg font-light tracking-wide font-inter">
              <TypewriterText text={subtitleFull} highlightFrom={highlightStart} delay={1000} />
            </p>
          </div>

          {/* Problem card */}
          <div className="gsap-hero-item w-full">
            {loadingPOTD ? <HeroSkeleton /> : !potd ? <EmptyState /> : <ProblemCard potd={potd} platformDesc={platformDesc} loadingPlatformDesc={loadingPlatformDesc} />}
          </div>

          {/* Stat cards */}
          {!loadingPOTD && (
            <div className="gsap-hero-item grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <StatCard icon={<div className="potd-stat-icon bg-emerald-500/8 border border-emerald-500/18"><Activity size={17} className="text-emerald-400" /></div>} value={todayRows.length} label="Solved Today" valueColor="text-emerald-400" />
              <StatCard icon={<div className="potd-stat-icon bg-yellow-500/8 border border-yellow-500/18"><Trophy size={17} className="text-yellow-400" /></div>} value={pointsRows.length} label="On Leaderboard" valueColor="text-yellow-400" />
              <StatCard icon={<div className="potd-stat-icon bg-orange-500/8 border border-orange-500/18"><Clock size={17} className="text-orange-400" /></div>} value={<CountdownTimer compact />} label="Time Remaining" valueColor="text-orange-400 font-mono tabular-nums" />
            </div>
          )}

          <ScrollCue />
        </div>
      </section>

      {/* ══════════ ARENA SECTION ══════════ */}
      <section id="potd-arena-section" className="relative px-6 py-28 w-full">
        <div className="potd-container">
          <SectionDivider icon={<Activity size={14} className="text-orange-400" />} label="Arena" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArenaCard title="Today's Solvers" icon={<Target size={15} className="text-emerald-400" />} badge="live" rows={todayRows} loading={loadingTodayRanking} emptyText={potd ? "No accepted submissions yet. Be the first!" : "No problem has been posted today."} />
            <ArenaCard title="Points Champions" icon={<Trophy size={15} className="text-yellow-400" />} badge="all-time" rows={pointsRows} loading={loadingPotdLeaderboard} showScore scoreLabel="Points" emptyText="No points recorded yet. Start solving!" />
          </div>
        </div>
      </section>

      {/* ══════════ CHAT NEXUS ══════════ */}
      <section className="px-6 pb-32 w-full">
        <div className="potd-container">
          <SectionDivider icon={<MessageSquare size={14} className="text-indigo-400" />} label="Chat Nexus" />
          <ChatNexus comments={comments} user={user} profile={profile} newCommentText={newCommentText} onCommentChange={setNewCommentText} onSubmit={handleAddComment} addingComment={addingComment} chatViewportRef={chatViewportRef} chatEndRef={chatEndRef} />
          <AnimatePresence>{errorMsg && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-center text-red-400/70 text-sm font-mono">{errorMsg}</motion.p>}</AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// EXPORT — wraps with ParticlesProvider
// ═══════════════════════════════════════════════════════════════════
const particlesInit = async (engine) => { await loadSlim(engine); };

export default function POTD() {
  return (
    <ParticlesProvider init={particlesInit}>
      <POTDInner />
    </ParticlesProvider>
  );
}
