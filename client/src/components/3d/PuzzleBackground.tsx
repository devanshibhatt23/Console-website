import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════
   GRID CONFIGURATION
   ═══════════════════════════════════════════════════════════════ */
const COLS = 4;
const ROWS = 3;
const CW = 210;         // base cell width
const CH = 160;         // base cell height
const T = 36;           // tab padding (piece extends T px beyond its cell)
const TH = 30;          // tab curve amplitude
const PW = CW + 2 * T;  // full piece div width  = 282
const PH = CH + 2 * T;  // full piece div height = 232
const IMG_W = COLS * CW; // 840
const IMG_H = ROWS * CH; // 480
const IMAGE_PATH = '/images/IMG_1590.jpg';

/* ═══════════════════════════════════════════════════════════════
   INTERLOCKING EDGE TYPES
   Interlocking rule:
     bottom(c,r) = hEdge(c,r) → top(c,r+1) = -hEdge(c,r)
     right(c,r)  = vEdge(c,r) → left(c+1,r) = -vEdge(c,r)
   ═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   SVG CLIP PATH GENERATOR
   Local space: base cell at [T, T+CW] × [T, T+CH]
   ═══════════════════════════════════════════════════════════════ */
function buildPiecePath(col: number, row: number): string {
  const { top, bottom, right, left } = getEdgeTypes(col, row);
  const x0 = T, y0 = T, x1 = T + CW, y1 = T + CH;

  function hTab(ax: number, ay: number, bx: number, _by: number, dir: number): string {
    const mx = (ax + bx) / 2, qx = (bx - ax) * 0.2;
    return `L ${mx - qx},${ay} C ${mx - qx},${ay - dir * TH} ${mx + qx},${ay - dir * TH} ${mx + qx},${ay} L ${bx},${ay}`;
  }
  function vTab(ax: number, ay: number, _bx: number, by: number, dir: number): string {
    const my = (ay + by) / 2, qy = (by - ay) * 0.2;
    return `L ${ax},${my - qy} C ${ax + dir * TH},${my - qy} ${ax + dir * TH},${my + qy} ${ax},${my + qy} L ${ax},${by}`;
  }

  let d = `M ${x0},${y0}`;
  // TOP (left→right)
  d += top  === 0 ? ` L ${x1},${y0}` : hTab(x0, y0, x1, y0, top);
  // RIGHT (top→bottom)
  d += right === 0 ? ` L ${x1},${y1}` : vTab(x1, y0, x1, y1, right);
  // BOTTOM (right→left) — direction reversed so dir is negated
  d += bottom === 0 ? ` L ${x0},${y1}` : hTab(x1, y1, x0, y1, -bottom);
  // LEFT (bottom→top) — direction reversed
  d += left === 0 ? ` L ${x0},${y0}` : vTab(x0, y1, x0, y0, -left);
  d += ' Z';
  return d;
}

/* ═══════════════════════════════════════════════════════════════
   PIECE DATA
   ═══════════════════════════════════════════════════════════════ */
interface PieceData {
  id: number;
  col: number;
  row: number;
  path: string;
  bgX: number;  // background-position-x at assembled state
  bgY: number;
  sx: number; sy: number; sz: number;   // scatter position
  srx: number; sry: number; srz: number; // scatter rotation
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
      const dist  = rand(++s, 380, 700);
      pieces.push({
        id, col, row,
        path: buildPiecePath(col, row),
        bgX: T - col * CW,
        bgY: T - row * CH,
        sx: Math.cos(angle) * dist,
        sy: Math.sin(angle) * dist - 60,
        sz: rand(++s, -500, 80),
        srx: rand(++s, -200, 200),
        sry: rand(++s, -200, 200),
        srz: rand(++s, -90, 90),
      });
    }
  }
  return pieces;
}

const ALL_PIECES = buildAllPieces();

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PuzzleImageBackground() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stageRef  = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scale the 840×480 stage to COVER the hero (like background-size: cover)
  const applyScale = useCallback(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;
    const scaleX = wrap.offsetWidth  / IMG_W;
    const scaleY = wrap.offsetHeight / IMG_H;
    const scale  = Math.max(scaleX, scaleY) * 1.02; // tiny 2% overdraw to eliminate edge gaps
    gsap.set(stage, { scale, transformOrigin: 'center center' });
  }, []);

  useEffect(() => {
    const els = pieceRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length !== ALL_PIECES.length) return;

    // Apply responsive cover scale
    applyScale();
    const ro = new ResizeObserver(applyScale);
    if (wrapRef.current) ro.observe(wrapRef.current);

    // ── Set initial scatter state ────────────────────────────────
    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      gsap.set(el, {
        x: p.sx, y: p.sy, z: p.sz,
        rotateX: p.srx, rotateY: p.sry, rotateZ: p.srz,
        opacity: 0, scale: 0.55,
      });
    });

    // ── ONE-TIME animation: scatter → assemble → hold ────────────
    const tl = gsap.timeline();

    // Phase 1 (0–2s): pieces materialise scattered, tumbling
    tl.to(els, {
      opacity: 0.88,
      scale: 1,
      duration: 1.5,
      stagger: { amount: 1.0, from: 'random', ease: 'power1.in' },
      ease: 'power2.out',
    }, 0);

    // Simultaneous tumble drift during scatter phase
    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      tl.to(el, {
        rotateX: p.srx + rand(i * 29, 100, 220),
        rotateY: p.sry + rand(i * 31, 140, 300),
        rotateZ: p.srz + rand(i * 37, 50, 110),
        x: p.sx * 0.7,
        y: p.sy * 0.7,
        duration: 2.2,
        ease: 'sine.inOut',
      }, 0.15 + rand(i * 11, 0, 0.25));
    });

    // Phase 2 (2.4–6.2s): grand assembly — outer pieces sweep in first
    const cx = COLS / 2 - 0.5, cy = ROWS / 2 - 0.5;
    const byDistFromCenter = [...ALL_PIECES].sort((a, b) => {
      const da = Math.hypot(a.col - cx, a.row - cy);
      const db = Math.hypot(b.col - cx, b.row - cy);
      return db - da; // outer first
    });

    byDistFromCenter.forEach((p, orderIdx) => {
      const el = els[p.id];
      tl.to(el, {
        x: 0, y: 0, z: 0,
        rotateX: 0, rotateY: 0, rotateZ: 0,
        scale: 1,
        opacity: 1,
        duration: 2.0,
        ease: 'expo.out',
        onComplete: () => {
          // Snap-flash on each piece clicking into place
          gsap.fromTo(el,
            { filter: 'brightness(2.2) drop-shadow(0 0 18px rgba(255,200,100,0.9))' },
            { filter: 'brightness(1) drop-shadow(0 12px 28px rgba(0,0,0,0.55))', duration: 0.5, ease: 'power2.out' }
          );
        },
      }, 2.4 + orderIdx * 0.13);
    });

    // Phase 3 (after assembly): assembled image stays — gentle collective breath
    const holdStart = 2.4 + byDistFromCenter.length * 0.13 + 2.0 + 0.3;

    tl.to(stageRef.current, {
      rotateY: 4, rotateX: -2.5,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    }, holdStart);

    // ── Mouse parallax (persistent) ──────────────────────────────
    const onMouse = (e: MouseEvent) => {
      const ry = (e.clientX / window.innerWidth  - 0.5) * 22;
      const rx = (e.clientY / window.innerHeight - 0.5) * -14;
      gsap.to(stageRef.current, {
        rotateX: rx, rotateY: ry,
        duration: 2.0, ease: 'power2.out', overwrite: 'auto',
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
      style={{ perspective: '1100px' }}
    >
      {/* Stage — 840×480 base, scaled up to COVER the hero */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: IMG_W,
          height: IMG_H,
          transformStyle: 'preserve-3d',
          flexShrink: 0,
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
              // Real image slice: this piece shows its correct crop of the photo
              backgroundImage: `url('${IMAGE_PATH}')`,
              backgroundSize: `${IMG_W}px ${IMG_H}px`,
              backgroundPosition: `${piece.bgX}px ${piece.bgY}px`,
              backgroundRepeat: 'no-repeat',
              // Interlocking puzzle shape
              clipPath: `path('${piece.path}')`,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55)) brightness(1)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Specular top-left sheen */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,220,140,0.18) 0%, rgba(255,120,60,0.04) 40%, transparent 65%)',
              pointerEvents: 'none',
            }} />
            {/* Bottom-right rim darkening */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(315deg, rgba(0,0,0,0.28) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
          </div>
        ))}

        {/* Vignette over the assembled image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />
      </div>
    </div>
  );
}
