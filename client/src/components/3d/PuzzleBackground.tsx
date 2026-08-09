import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════
   3D FLOATING PUZZLE SHOWCASE (AWARD-WINNING DRIBBBLE STYLE)
   - Volumetric 3D puzzle pieces with metallic rim glows, specular highlights
   - Floating in 3D perspective space with tumbling assembly into a majestic composition
   - Sharp, non-blurry rendering with crisp texturing
   ═══════════════════════════════════════════════════════════════ */

const COLS = 4;
const ROWS = 3;
const CW = 280;          // High-res piece base width (1120px total)
const CH = 200;          // High-res piece base height (600px total)
const T = 45;            // Interlocking tab padding
const TH = 38;           // Tab bump amplitude
const PW = CW + 2 * T;   // Piece element width  = 370px
const PH = CH + 2 * T;   // Piece element height = 290px
const IMG_W = COLS * CW; // 1120px
const IMG_H = ROWS * CH; // 600px
const IMAGE_PATH = '/images/IMG_1590.jpg';

const hEdge = (c: number, r: number): number => (c + r) % 2 === 0 ? 1 : -1;
const vEdge = (c: number, r: number): number => (c + r + 1) % 2 === 0 ? 1 : -1;

function getEdgeTypes(col: number, row: number) {
  return {
    top:    row === 0        ? 0 : -hEdge(col, row - 1),
    bottom: row === ROWS - 1 ? 0 :  hEdge(col, row),
    right:  col === COLS - 1 ? 0 :  vEdge(col, row),
    left:   col === 0        ? 0 : -vEdge(col - 1, row),
  };
}

function buildPiecePath(col: number, row: number): string {
  const { top, bottom, right, left } = getEdgeTypes(col, row);
  const x0 = T, y0 = T, x1 = T + CW, y1 = T + CH;

  function hTab(ax: number, ay: number, bx: number, _by: number, dir: number): string {
    const mx = (ax + bx) / 2, qx = (bx - ax) * 0.22;
    return `L ${mx - qx},${ay} C ${mx - qx},${ay - dir * TH} ${mx + qx},${ay - dir * TH} ${mx + qx},${ay} L ${bx},${ay}`;
  }
  function vTab(ax: number, ay: number, _bx: number, by: number, dir: number): string {
    const my = (ay + by) / 2, qy = (by - ay) * 0.22;
    return `L ${ax},${my - qy} C ${ax + dir * TH},${my - qy} ${ax + dir * TH},${my + qy} ${ax},${my + qy} L ${ax},${by}`;
  }

  let d = `M ${x0},${y0}`;
  d += top    === 0 ? ` L ${x1},${y0}` : hTab(x0, y0, x1, y0, top);
  d += right  === 0 ? ` L ${x1},${y1}` : vTab(x1, y0, x1, y1, right);
  d += bottom === 0 ? ` L ${x0},${y1}` : hTab(x1, y1, x0, y1, -bottom);
  d += left   === 0 ? ` L ${x0},${y0}` : vTab(x0, y1, x0, y0, -left);
  d += ' Z';
  return d;
}

interface PieceData {
  id: number;
  col: number;
  row: number;
  path: string;
  bgX: number;
  bgY: number;
  sx: number; sy: number; sz: number;
  srx: number; sry: number; srz: number;
}

function rand(seed: number, min: number, max: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return min + (s - Math.floor(s)) * (max - min);
}

function buildAllPieces(): PieceData[] {
  const pieces: PieceData[] = [];
  let s = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = row * COLS + col;
      const angle = rand(++s, 0, Math.PI * 2);
      const dist  = rand(++s, 420, 850);
      pieces.push({
        id, col, row,
        path: buildPiecePath(col, row),
        bgX: T - col * CW,
        bgY: T - row * CH,
        sx: Math.cos(angle) * dist,
        sy: Math.sin(angle) * dist - 80,
        sz: rand(++s, -600, 150),
        srx: rand(++s, -240, 240),
        sry: rand(++s, -240, 240),
        srz: rand(++s, -120, 120),
      });
    }
  }
  return pieces;
}

const ALL_PIECES = buildAllPieces();

export default function PuzzleImageBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);

  const applyScale = useCallback(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    // Cover scale calculation — scales the puzzle assembly to fit 100% completely across full hero viewport
    const scaleX = wrap.offsetWidth / IMG_W;
    const scaleY = wrap.offsetHeight / IMG_H;
    const scale = Math.max(scaleX, scaleY) * 1.02;
    gsap.set(stage, { scale, transformOrigin: 'center center' });
  }, []);

  useEffect(() => {
    const els = pieceRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length !== ALL_PIECES.length) return;

    applyScale();
    const ro = new ResizeObserver(applyScale);
    if (wrapRef.current) ro.observe(wrapRef.current);

    // Initial scatter positioning
    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      gsap.set(el, {
        x: p.sx, y: p.sy, z: p.sz,
        rotateX: p.srx, rotateY: p.sry, rotateZ: p.srz,
        opacity: 0, scale: 0.5,
      });
    });

    const tl = gsap.timeline();

    // 1. Fade & Tumble in 3D space
    tl.to(els, {
      opacity: 0.95,
      scale: 1,
      duration: 1.4,
      stagger: { amount: 0.8, from: 'random' },
      ease: 'power2.out',
    }, 0);

    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      tl.to(el, {
        rotateX: p.srx + rand(i * 29, 120, 240),
        rotateY: p.sry + rand(i * 31, 160, 320),
        rotateZ: p.srz + rand(i * 37, 60, 140),
        x: p.sx * 0.6,
        y: p.sy * 0.6,
        duration: 2.2,
        ease: 'sine.inOut',
      }, 0.1);
    });

    // 2. Majestic Snap Assembly
    const cx = COLS / 2 - 0.5, cy = ROWS / 2 - 0.5;
    const byDist = [...ALL_PIECES].sort((a, b) => {
      return Math.hypot(b.col - cx, b.row - cy) - Math.hypot(a.col - cx, a.row - cy);
    });

    byDist.forEach((p, orderIdx) => {
      const el = els[p.id];
      tl.to(el, {
        x: 0, y: 0, z: 0,
        rotateX: 0, rotateY: 0, rotateZ: 0,
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: 'expo.out',
        onComplete: () => {
          gsap.fromTo(el,
            { filter: 'drop-shadow(0 0 25px rgba(242,153,74,0.9)) brightness(1.6)' },
            { filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.7)) brightness(1.05)', duration: 0.6, ease: 'power2.out' }
          );
        },
      }, 2.2 + orderIdx * 0.11);
    });

    // 3. Persistent 3D Floating & Mouse Parallax
    const holdTime = 2.2 + byDist.length * 0.11 + 1.8;
    tl.to(stageRef.current, {
      rotateY: 6,
      rotateX: -4,
      y: -12,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    }, holdTime);

    const onMouse = (e: MouseEvent) => {
      const ry = (e.clientX / window.innerWidth - 0.5) * 26;
      const rx = (e.clientY / window.innerHeight - 0.5) * -16;
      gsap.to(stageRef.current, {
        rotateX: rx,
        rotateY: ry,
        duration: 2.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    window.addEventListener('mousemove', onMouse);

    return () => {
      tl.kill();
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, [applyScale]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 z-[2] flex items-center justify-center overflow-hidden pointer-events-none"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Stage Frame */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: IMG_W,
          height: IMG_H,
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg) rotateY(-4deg)',
        }}
      >
        {ALL_PIECES.map((piece, i) => (
          <div
            key={piece.id}
            ref={(el) => { pieceRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              left: piece.col * CW - T,
              top:  piece.row * CH - T,
              width: PW,
              height: PH,
              backgroundImage: `url('${IMAGE_PATH}')`,
              backgroundSize: `${IMG_W}px ${IMG_H}px`,
              backgroundPosition: `${piece.bgX}px ${piece.bgY}px`,
              backgroundRepeat: 'no-repeat',
              clipPath: `path('${piece.path}')`,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.7)) brightness(1.05)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* 3D Metallic Edge Glow & Specular Highlight */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(242,153,74,0.15) 35%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(315deg, rgba(0,0,0,0.4) 0%, transparent 60%)',
              pointerEvents: 'none',
            }} />
          </div>
        ))}

        {/* Ambient Glow behind assembled pieces */}
        <div style={{
          position: 'absolute',
          inset: -40,
          background: 'radial-gradient(ellipse at center, rgba(242,153,74,0.18) 0%, rgba(240,64,92,0.1) 50%, transparent 75%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          zIndex: -1,
        }} />
      </div>
    </div>
  );
}
