import { useEffect, useRef, useState } from "react";
import { signInWithGoogle } from "../services/auth";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { gsap } from "gsap";
import { Zap, Shield, ArrowRight } from "lucide-react";
import "./Login.css";

// ─── Particle Network Canvas ──────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 75;
    const DIST  = 130;

    const particles = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 1.3 + 0.4,
      a:  Math.random() * 0.45 + 0.1,
    }));

    let animId;
    const tick = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242,153,74,${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < COUNT; j++) {
          const q   = particles[j];
          const dx  = p.x - q.x;
          const dy  = p.y - q.y;
          const d   = Math.sqrt(dx * dx + dy * dy);
          if (d < DIST) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(242,153,74,${0.075 * (1 - d / DIST)})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="login-canvas" aria-hidden="true" />;
}

// ─── GSAP Terminal Typewriter ─────────────────────────────────────────────────
function TerminalLine() {
  const lineRef = useRef(null);

  useEffect(() => {
    const LINES = [
      "> booting console.mnit.ac.in...",
      "> establishing secure tunnel...",
      "> loading developer profile...",
      "> access granted. welcome.",
    ];
    let idx = 0;
    let tl;
    let timeout;

    const type = () => {
      if (!lineRef.current) return;
      const text = LINES[idx % LINES.length];
      lineRef.current.textContent = "";

      tl = gsap.timeline({
        onComplete: () => {
          timeout = setTimeout(() => { idx++; type(); }, 1800);
        },
      });
      tl.to(lineRef.current, {
        duration: text.length * 0.038,
        ease: "none",
        onUpdate() {
          if (lineRef.current)
            lineRef.current.textContent = text.slice(0, Math.round(this.progress() * text.length));
        },
      });
    };

    timeout = setTimeout(type, 600);
    return () => {
      clearTimeout(timeout);
      tl?.kill();
    };
  }, []);

  return (
    <div className="login-terminal">
      <div className="login-term-header">
        <span className="login-term-dot red"   />
        <span className="login-term-dot yellow"/>
        <span className="login-term-dot green" />
        <span className="login-term-title">console ~ terminal</span>
      </div>
      <div className="login-term-body">
        <span ref={lineRef} className="login-term-text" />
        <span className="login-term-cursor" aria-hidden="true">▋</span>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
export default function Login() {
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* GPU-accelerated particle network */}
      <ParticleCanvas />

      {/* Ambient colour orbs */}
      <div className="login-orbs" aria-hidden="true">
        {[1,2,3,4,5,6].map(i => <div key={i} className={`login-orb login-orb-${i}`} />)}
      </div>

      {/* Subtle grid overlay */}
      <div className="login-grid-overlay" aria-hidden="true" />

      {/* Centred content */}
      <div className="login-shell">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            glareEnable
            glareMaxOpacity={0.04}
            glareColor="#F2994A"
            glarePosition="all"
            glareBorderRadius="24px"
            scale={1.008}
            transitionSpeed={600}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="login-card">
              <div className="login-card-scanline" aria-hidden="true" />

              {/* Brand section */}
              <div className="login-brand-wrap">
                <div className="login-eyebrow">
                  <Zap size={10} aria-hidden="true" />
                  <span>CONSOLE // MNIT.AC.IN</span>
                </div>
                <h1 className="login-brand">CONSOLE</h1>
                <p className="login-tagline">
                  The official coding club of MNIT Jaipur.
                  <br />Enter the developer universe.
                </p>
              </div>

              {/* Terminal typewriter */}
              <TerminalLine />

              {/* Error message */}
              {error && (
                <motion.div
                  className="login-error"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0  }}
                  transition={{ duration: 0.25 }}
                  role="alert"
                >
                  ⚠ {error}
                </motion.div>
              )}

              {/* Google OAuth button */}
              <button
                id="login-google-btn"
                className="login-btn-google"
                onClick={handleLogin}
                disabled={loading}
                aria-label="Continue with Google"
              >
                <span className="login-btn-shimmer" aria-hidden="true" />

                {loading ? (
                  <span className="login-spinner" aria-hidden="true" />
                ) : (
                  <svg
                    className="login-google-icon"
                    width="18" height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}

                <span className="login-btn-label">
                  {loading ? "Connecting..." : "Continue with Google"}
                </span>

                {!loading && <ArrowRight size={15} className="login-btn-arrow" aria-hidden="true" />}
              </button>

              {/* Domain restriction notice */}
              <div className="login-restrict">
                <Shield size={11} aria-hidden="true" />
                <span>Only <strong>@mnit.ac.in</strong> emails are permitted</span>
              </div>
            </div>
          </Tilt>
        </motion.div>
      </div>
    </div>
  );
}