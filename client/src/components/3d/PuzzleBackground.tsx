import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ─────────────────────────────────────────────────────────────────────────────
// Real SVG puzzle piece paths — 100×100 coordinate space
// Each side is either a tab (bump out) or a socket (indent in)
// ─────────────────────────────────────────────────────────────────────────────
const PIECE_PATHS = [
  // A: top-tab, right-tab, bottom-socket, left-socket
  'M 0,0 L 33,0 C 33,-22 67,-22 67,0 L 100,0 L 100,33 C 122,33 122,67 100,67 L 100,100 L 67,100 C 67,78 33,78 33,100 L 0,100 L 0,67 C 22,67 22,33 0,33 Z',
  // B: top-socket, right-tab, bottom-tab, left-socket
  'M 0,0 L 33,0 C 33,22 67,22 67,0 L 100,0 L 100,33 C 122,33 122,67 100,67 L 100,100 L 67,100 C 67,122 33,122 33,100 L 0,100 L 0,67 C 22,67 22,33 0,33 Z',
  // C: top-tab, right-socket, bottom-tab, left-tab
  'M 0,0 L 33,0 C 33,-22 67,-22 67,0 L 100,0 L 100,33 C 78,33 78,67 100,67 L 100,100 L 67,100 C 67,122 33,122 33,100 L 0,100 L 0,67 C -22,67 -22,33 0,33 Z',
  // D: top-socket, right-socket, bottom-socket, left-tab
  'M 0,0 L 33,0 C 33,22 67,22 67,0 L 100,0 L 100,33 C 78,33 78,67 100,67 L 100,100 L 67,100 C 67,78 33,78 33,100 L 0,100 L 0,67 C -22,67 -22,33 0,33 Z',
  // E: top-tab, right-tab, bottom-tab, left-tab (all tabs)
  'M 0,0 L 33,0 C 33,-22 67,-22 67,0 L 100,0 L 100,33 C 122,33 122,67 100,67 L 100,100 L 67,100 C 67,122 33,122 33,100 L 0,100 L 0,67 C -22,67 -22,33 0,33 Z',
  // F: all sockets
  'M 0,0 L 33,0 C 33,22 67,22 67,0 L 100,0 L 100,33 C 78,33 78,67 100,67 L 100,100 L 67,100 C 67,78 33,78 33,100 L 0,100 L 0,67 C 22,67 22,33 0,33 Z',
];

// Brand palette — warm oranges, crimsons, ambers; plus a couple of accent cooler tones for depth
const PIECE_COLORS: [string, string, string][] = [
  ['#F2994A', '#D97B35', '#FF8C42'],
  ['#F0405C', '#C8203C', '#FF5B72'],
  ['#FFB347', '#E89A30', '#FFC764'],
  ['#E85D26', '#C44015', '#FF7040'],
  ['#FF6B6B', '#E53935', '#FF9494'],
  ['#F2994A', '#F0405C', '#FFA65E'],
  ['#FFAA33', '#D97B35', '#FFC05A'],
  ['#F0405C', '#A01535', '#FF5B72'],
  ['#E07B35', '#B85520', '#F2994A'],
];

interface Piece {
  id: number;
  path: string;
  size: number;
  colors: [string, string, string];
  opacity: number;
  blur: number;
  // scatter start (from center in px)
  sx: number;
  sy: number;
  sz: number;
  srx: number;
  sry: number;
  srz: number;
  // assembly target
  tx: number;
  ty: number;
  tz: number;
  trz: number;
}

function buildPieces(): Piece[] {
  const count = 20;
  const arr: Piece[] = [];
  const assemblyRadius = 140;

  // Seeded-ish deterministic values for SSR safety
  const rng = (seed: number, min: number, max: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return min + ((x - Math.floor(x)) * (max - min));
  };

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const scatterAngle = rng(i * 3 + 1, 0, Math.PI * 2);
    const scatterDist = rng(i * 7 + 2, 350, 700);

    arr.push({
      id: i,
      path: PIECE_PATHS[i % PIECE_PATHS.length],
      size: rng(i * 5 + 3, 55, 130),
      colors: PIECE_COLORS[i % PIECE_COLORS.length],
      opacity: rng(i * 11 + 4, 0.45, 0.88),
      blur: i % 5 === 0 ? rng(i, 1, 2.5) : 0,
      sx: Math.cos(scatterAngle) * scatterDist,
      sy: Math.sin(scatterAngle) * scatterDist - 80,
      sz: rng(i * 13 + 5, -700, 150),
      srx: rng(i * 17 + 6, 0, 360),
      sry: rng(i * 19 + 7, 0, 360),
      srz: rng(i * 23 + 8, 0, 360),
      // Assembly: loose ellipse, slightly off-center to feel natural
      tx: Math.cos(angle) * assemblyRadius * (1 + rng(i, -0.25, 0.25)),
      ty: Math.sin(angle) * assemblyRadius * 0.7 * (1 + rng(i * 2, -0.2, 0.2)),
      tz: rng(i * 3, -60, 60),
      trz: rng(i * 4, -25, 25),
    });
  }
  return arr;
}

const PIECES = buildPieces();

export default function PuzzleBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = elRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!els.length) return;

    // ── Set initial scatter positions ────────────────────────────────────────
    els.forEach((el, i) => {
      const p = PIECES[i];
      gsap.set(el, {
        x: p.sx,
        y: p.sy,
        z: p.sz,
        rotateX: p.srx,
        rotateY: p.sry,
        rotateZ: p.srz,
        opacity: 0,
        scale: 0.4,
      });
    });

    // ── Master looping timeline ──────────────────────────────────────────────
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });

    // PHASE 1 — 0..2.5s: fade in & tumble in scatter
    tl.to(els, {
      opacity: (i) => PIECES[i]?.opacity ?? 0.6,
      scale: 1,
      duration: 1.4,
      stagger: 0.07,
      ease: 'power2.out',
    }, 0);

    els.forEach((el, i) => {
      const p = PIECES[i];
      tl.to(el, {
        rotateX: `+=${180 + (i % 3) * 60}`,
        rotateY: `+=${240 + (i % 4) * 45}`,
        rotateZ: `+=${120 + (i % 2) * 80}`,
        x: p.sx * 0.65,
        y: p.sy * 0.65,
        duration: 2.4,
        ease: 'power1.inOut',
      }, 0.1 + i * 0.04);
    });

    // PHASE 2 — 2.5..5.2s: assemble into ellipse
    tl.to(els, {
      x: (i) => PIECES[i]?.tx ?? 0,
      y: (i) => PIECES[i]?.ty ?? 0,
      z: (i) => PIECES[i]?.tz ?? 0,
      rotateX: (i) => (i % 3 - 1) * 18,
      rotateY: (i) => (i % 2 === 0 ? 1 : -1) * 12,
      rotateZ: (i) => PIECES[i]?.trz ?? 0,
      duration: 2.4,
      stagger: { amount: 0.7, from: 'random' },
      ease: 'power3.inOut',
    }, 2.6);

    // PHASE 3 — 5.2..7.5s: hold assembled, slow collective drift
    tl.to(stageRef.current, {
      rotateY: '+=6',
      rotateX: '-=4',
      duration: 2.2,
      ease: 'sine.inOut',
    }, 5.3);

    // PHASE 4 — 7.5..9.8s: scatter out + fade
    tl.to(els, {
      x: (i) => PIECES[i]?.sx ?? 0,
      y: (i) => PIECES[i]?.sy ?? 0,
      z: (i) => PIECES[i]?.sz ?? 0,
      rotateX: (i) => (PIECES[i]?.srx ?? 0) + 360,
      rotateY: (i) => (PIECES[i]?.sry ?? 0) + 360,
      rotateZ: (i) => (PIECES[i]?.srz ?? 0) + 180,
      opacity: 0,
      scale: 0.4,
      duration: 2.2,
      stagger: { amount: 0.9, from: 'random' },
      ease: 'power2.in',
    }, 7.6);

    // Reset for next loop
    tl.call(() => {
      els.forEach((el, i) => {
        const p = PIECES[i];
        gsap.set(el, {
          x: p.sx, y: p.sy, z: p.sz,
          rotateX: p.srx, rotateY: p.sry, rotateZ: p.srz,
          opacity: 0, scale: 0.4,
        });
      });
      gsap.set(stageRef.current, { rotateY: 0, rotateX: 0 });
    }, [], 9.7);

    // ── Mouse parallax on the stage ──────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const rx = ((e.clientY / window.innerHeight) - 0.5) * -22;
      const ry = ((e.clientX / window.innerWidth) - 0.5) * 32;
      gsap.to(stageRef.current, {
        rotateX: rx,
        rotateY: ry,
        duration: 2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      tl.kill();
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 z-[2] overflow-hidden pointer-events-none"
      style={{ perspective: '1100px' }}
    >
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {PIECES.map((piece, i) => (
          <div
            key={piece.id}
            ref={(el) => { elRefs.current[i] = el; }}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              filter: [
                piece.blur > 0 ? `blur(${piece.blur.toFixed(1)}px)` : '',
                `drop-shadow(0 6px 18px ${piece.colors[0]}55)`,
              ].filter(Boolean).join(' '),
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="-28 -28 156 156"
              style={{ overflow: 'visible' }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id={`pg-${piece.id}`}
                  x1="0%" y1="0%" x2="100%" y2="100%"
                >
                  <stop offset="0%" stopColor={piece.colors[0]} stopOpacity="0.92" />
                  <stop offset="100%" stopColor={piece.colors[1]} stopOpacity="0.72" />
                </linearGradient>
                <linearGradient
                  id={`ps-${piece.id}`}
                  x1="0%" y1="0%" x2="40%" y2="80%"
                >
                  <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                  <stop offset="55%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>

              {/* Soft shadow offset */}
              <path
                d={piece.path}
                fill={piece.colors[1]}
                opacity={0.35}
                transform="translate(4,5)"
              />

              {/* Main gradient face */}
              <path d={piece.path} fill={`url(#pg-${piece.id})`} />

              {/* Specular sheen */}
              <path d={piece.path} fill={`url(#ps-${piece.id})`} />

              {/* Crisp edge highlight */}
              <path
                d={piece.path}
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth="1.8"
              />

              {/* Inner edge (rim light effect) */}
              <path
                d={piece.path}
                fill="none"
                stroke={piece.colors[2]}
                strokeWidth="0.8"
                opacity="0.5"
                transform="translate(0.5,0.5)"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
