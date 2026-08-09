import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════ */
const COLS = 4;
const ROWS = 3;
const CW = 210;         // base cell width  (4 × 210 = 840)
const CH = 160;         // base cell height (3 × 160 = 480)
const T = 36;           // tab padding — piece extends T px beyond its cell on all sides
const TH = 30;          // tab curve height (amplitude of the bezier bump)
const PW = CW + 2 * T;  // full piece div width  = 282
const PH = CH + 2 * T;  // full piece div height = 232
const IMG_W = COLS * CW; // 840
const IMG_H = ROWS * CH; // 480
const IMAGE_PATH = '/images/IMG_1590.jpg';

/* ═══════════════════════════════════════════════════════════════
   INTERLOCKING EDGE TYPES
   hEdge(c,r) → sign for horizontal boundary between row r and r+1 at col c
   vEdge(c,r) → sign for vertical boundary between col c and c+1 at row r
   +1 = tab protrudes forward (down / right)
   -1 = socket (receiving the tab)
   Interlocking rule: bottom of piece(c,r) = hEdge(c,r), top of piece(c,r+1) = -hEdge(c,r)
   ═══════════════════════════════════════════════════════════════ */
const hEdge = (c: number, r: number): number => (c + r) % 2 === 0 ? 1 : -1;
const vEdge = (c: number, r: number): number => (c + r + 1) % 2 === 0 ? 1 : -1;

function getEdgeTypes(col: number, row: number) {
  return {
    top:    row === 0        ? 0 : -hEdge(col, row - 1),   // opposite of bottom above
    bottom: row === ROWS - 1 ? 0 :  hEdge(col, row),
    right:  col === COLS - 1 ? 0 :  vEdge(col, row),
    left:   col === 0        ? 0 : -vEdge(col - 1, row),   // opposite of right of neighbour
  };
}

/* ═══════════════════════════════════════════════════════════════
   SVG PATH GENERATOR
   Coordinates are in the piece div's local space.
   Base cell occupies: x ∈ [T, T+CW], y ∈ [T, T+CH]
   ═══════════════════════════════════════════════════════════════ */
function buildPiecePath(col: number, row: number): string {
  const { top, bottom, right, left } = getEdgeTypes(col, row);

  // Cubic bezier tab helper:
  //   edge: the axis-aligned coordinate of the edge
  //   mid1/mid2: the range along the perpendicular axis where the tab sits
  //   dir: +1 = bump outward, -1 = bump inward
  //   axis: 'x' or 'y'
  function tab(
    startX: number, startY: number,
    endX: number, endY: number,
    dir: number, axis: 'h' | 'v'
  ): string {
    if (axis === 'h') {
      // horizontal edge: tab goes up/down (y-axis variation)
      const mx = (startX + endX) / 2;
      const qx = (endX - startX) * 0.2;
      return (
        `L ${mx - qx},${startY}` +
        ` C ${mx - qx},${startY - dir * TH} ${mx + qx},${startY - dir * TH} ${mx + qx},${startY}` +
        ` L ${endX},${endY}`
      );
    } else {
      // vertical edge: tab goes left/right (x-axis variation)
      const my = (startY + endY) / 2;
      const qy = (endY - startY) * 0.2;
      return (
        `L ${startX},${my - qy}` +
        ` C ${startX + dir * TH},${my - qy} ${startX + dir * TH},${my + qy} ${startX},${my + qy}` +
        ` L ${endX},${endY}`
      );
    }
  }

  const x0 = T, y0 = T;
  const x1 = T + CW, y1 = T + CH;

  let d = `M ${x0},${y0}`;

  // TOP (left → right)
  d += top === 0
    ? ` L ${x1},${y0}`
    : tab(x0, y0, x1, y0, top, 'h');

  // RIGHT (top → bottom)
  d += right === 0
    ? ` L ${x1},${y1}`
    : tab(x1, y0, x1, y1, right, 'v');

  // BOTTOM (right → left)
  d += bottom === 0
    ? ` L ${x0},${y1}`
    : tab(x1, y1, x0, y1, -bottom, 'h');  // reversed direction: dir flipped

  // LEFT (bottom → top)
  d += left === 0
    ? ` L ${x0},${y0}`
    : tab(x0, y1, x0, y0, -left, 'v');   // reversed direction

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
  // Background offset so the image aligns perfectly when assembled
  bgX: number;
  bgY: number;
  // Scatter-state (what GSAP animates FROM on scatter, animates TO on assembly from)
  scatterX: number;
  scatterY: number;
  scatterZ: number;
  scatterRX: number;
  scatterRY: number;
  scatterRZ: number;
  // Stagger order for assembly — pieces closer to center assemble first
  assemblyDelay: number;
}

function deterministicRand(seed: number, min: number, max: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return min + (s - Math.floor(s)) * (max - min);
}

function buildAllPieces(): PieceData[] {
  const pieces: PieceData[] = [];
  const cx = COLS / 2 - 0.5;
  const cy = ROWS / 2 - 0.5;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = row * COLS + col;
      const angle = deterministicRand(id * 3, 0, Math.PI * 2);
      const dist = deterministicRand(id * 7, 380, 680);
      // Pieces closer to centre assemble slightly earlier
      const distFromCenter = Math.hypot(col - cx, row - cy);
      const maxDist = Math.hypot(cx, cy);

      pieces.push({
        id,
        col,
        row,
        path: buildPiecePath(col, row),
        // The background-position that makes this piece show the correct image slice
        bgX: T - col * CW,
        bgY: T - row * CH,
        scatterX: Math.cos(angle) * dist,
        scatterY: Math.sin(angle) * dist - 60,
        scatterZ: deterministicRand(id * 13, -500, 80),
        scatterRX: deterministicRand(id * 17, -200, 200),
        scatterRY: deterministicRand(id * 19, -200, 200),
        scatterRZ: deterministicRand(id * 23, -90, 90),
        assemblyDelay: (1 - distFromCenter / maxDist) * 0.4,
      });
    }
  }
  return pieces;
}

// Pre-compute piece data at module level (stable across renders)
const ALL_PIECES = buildAllPieces();

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PuzzleImageBackground() {
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pieceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const setScatter = useCallback((els: HTMLDivElement[]) => {
    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      gsap.set(el, {
        x: p.scatterX,
        y: p.scatterY,
        z: p.scatterZ,
        rotateX: p.scatterRX,
        rotateY: p.scatterRY,
        rotateZ: p.scatterRZ,
        opacity: 0,
        scale: 0.55,
      });
    });
    gsap.set(stageRef.current, { rotateX: 0, rotateY: 0 });
  }, []);

  useEffect(() => {
    const els = pieceRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length !== ALL_PIECES.length) return;

    // Initial state: pieces scattered, invisible
    setScatter(els);

    /* ─── MAIN TIMELINE ──────────────────────────────────── */
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0 });
    tlRef.current = tl;

    // PHASE 1 ── 0..2.4s: Pieces materialise scattered, tumbling in 3D
    tl.to(els, {
      opacity: 0.9,
      scale: 1,
      duration: 1.6,
      stagger: { amount: 1.0, from: 'random', ease: 'power1.in' },
      ease: 'power2.out',
    }, 0);

    // While materialising, start rotating (continuous tumble)
    els.forEach((el, i) => {
      const p = ALL_PIECES[i];
      tl.to(el, {
        rotateX: p.scatterRX + deterministicRand(i * 29, 120, 240),
        rotateY: p.scatterRY + deterministicRand(i * 31, 160, 320),
        rotateZ: p.scatterRZ + deterministicRand(i * 37, 60, 120),
        x: p.scatterX * 0.72,
        y: p.scatterY * 0.72,
        duration: 2.5,
        ease: 'sine.inOut',
      }, 0.1 + deterministicRand(i * 11, 0, 0.3));
    });

    // PHASE 2 ── 2.5..5.8s: Grand assembly — pieces fly home
    // Outer pieces first (more dramatic sweeping motion)
    const assemblyOrder = [...ALL_PIECES].sort((a, b) => b.assemblyDelay - a.assemblyDelay);

    assemblyOrder.forEach((p, orderIdx) => {
      const el = els[p.id];
      tl.to(el, {
        x: 0, y: 0, z: 0,
        rotateX: 0, rotateY: 0, rotateZ: 0,
        scale: 1,
        opacity: 1,
        duration: 2.2,
        ease: 'expo.out',
        onComplete: () => {
          // Brief bright flash as piece snaps home
          gsap.fromTo(el, { filter: 'brightness(2.5)' }, {
            filter: 'brightness(1)',
            duration: 0.4,
            ease: 'power2.out',
          });
        },
      }, 2.5 + orderIdx * 0.12);
    });

    // PHASE 3 ── 6.2..10s: Image assembled — gentle collective float + parallax breathing
    tl.to(stageRef.current, {
      rotateY: 5,
      rotateX: -3,
      duration: 1.8,
      ease: 'sine.inOut',
    }, 6.2);
    tl.to(stageRef.current, {
      rotateY: -4,
      rotateX: 2,
      duration: 2.4,
      ease: 'sine.inOut',
    }, 8.0);

    // PHASE 4 ── 10.5..13s: Image shatters — pieces explode outward
    // Center pieces blow out first
    const shatterOrder = [...ALL_PIECES].sort((a, b) => a.assemblyDelay - b.assemblyDelay);
    shatterOrder.forEach((p, orderIdx) => {
      const el = els[p.id];
      tl.to(el, {
        x: p.scatterX,
        y: p.scatterY,
        z: p.scatterZ,
        rotateX: p.scatterRX + 360,
        rotateY: p.scatterRY + 360,
        rotateZ: p.scatterRZ + 180,
        opacity: 0,
        scale: 0.55,
        duration: 1.6,
        ease: 'power3.in',
      }, 10.5 + orderIdx * 0.07);
    });

    // Reset for loop
    tl.call(() => {
      setScatter(els);
    }, [], 13.0);

    /* ─── MOUSE PARALLAX ─────────────────────────────────── */
    const onMouse = (e: MouseEvent) => {
      if (!stageRef.current) return;
      const ry = (e.clientX / window.innerWidth - 0.5) * 28;
      const rx = (e.clientY / window.innerHeight - 0.5) * -18;
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
      window.removeEventListener('mousemove', onMouse);
    };
  }, [setScatter]);

  return (
    <div
      ref={perspectiveRef}
      aria-hidden="true"
      className="absolute inset-0 z-[2] flex items-center justify-center overflow-visible pointer-events-none"
      style={{ perspective: '1100px' }}
    >
      {/* Stage — the assembled image reference frame */}
      <div
        ref={stageRef}
        style={{
          position: 'relative',
          width: IMG_W,
          height: IMG_H,
          transformStyle: 'preserve-3d',
          // Slight 3D tilt so assembled image sits naturally
          transform: 'rotateX(6deg)',
        }}
      >
        {ALL_PIECES.map((piece, i) => (
          <div
            key={piece.id}
            ref={(el) => { pieceRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              left: piece.col * CW - T,
              top: piece.row * CH - T,
              width: PW,
              height: PH,
              // Image fragment: correct slice of background photo
              backgroundImage: `url('${IMAGE_PATH}')`,
              backgroundSize: `${IMG_W}px ${IMG_H}px`,
              backgroundPosition: `${piece.bgX}px ${piece.bgY}px`,
              backgroundRepeat: 'no-repeat',
              // Clip to interlocking puzzle piece shape
              clipPath: `path('${piece.path}')`,
              // 3D transform inheritance
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              // Depth effect: drop-shadow follows the clip-path contour
              filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.55)) brightness(1)',
              // Tiny border-radius on the piece div (doesn't affect clip-path but softens any AA)
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Specular sheen overlay — warm top-left highlight */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,220,150,0.18) 0%, rgba(255,120,60,0.05) 40%, transparent 65%)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom-right rim darkening (gives physical depth illusion) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(315deg, rgba(0,0,0,0.3) 0%, transparent 50%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}

        {/* Assembled image vignette — only visible when pieces are together */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
}
