import { useEffect, useRef } from 'react';

// ── Constellation Draw ───────────────────────────────────────────────────────
// Lets a visitor drag across the hero to trace their own constellation —
// nodes and links are styled to match the ambient tsParticles network
// (cyan links, soft indigo nodes). Finished shapes hang suspended in space
// with a gentle drift, then slowly dissolve back into the background.
interface Point {
  x: number;
  y: number;
}

interface Shape {
  points: Point[];
  createdAt: number;
  driftSeed: number;
}

const MAX_SHAPES = 8;
const SHAPE_LIFETIME_MS = 26000;
const FADE_OUT_MS = 4000;
const FADE_IN_MS = 350;
const MIN_POINT_DISTANCE = 26;

export default function ConstellationDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;

    const shapes: Shape[] = [];
    let active: Shape | null = null;
    let drawing = false;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function getPoint(e: PointerEvent): Point {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onPointerDown(e: PointerEvent) {
      drawing = true;
      const p = getPoint(e);
      active = { points: [p], createdAt: performance.now(), driftSeed: Math.random() * 1000 };
      canvas!.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawing || !active) return;
      const p = getPoint(e);
      const pts = active.points;
      const last = pts[pts.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) >= MIN_POINT_DISTANCE) {
        pts.push(p);
      }
    }

    function finishShape() {
      if (!drawing) return;
      drawing = false;
      const shape = active;
      active = null;
      if (shape && shape.points.length >= 2) {
        shapes.push(shape);
        if (shapes.length > MAX_SHAPES) shapes.shift();
      }
    }

    canvas!.addEventListener('pointerdown', onPointerDown);
    canvas!.addEventListener('pointermove', onPointerMove);
    canvas!.addEventListener('pointerup', finishShape);
    canvas!.addEventListener('pointerleave', finishShape);
    canvas!.addEventListener('pointercancel', finishShape);

    let raf = 0;
    function draw() {
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      for (let i = shapes.length - 1; i >= 0; i--) {
        if (now - shapes[i].createdAt > SHAPE_LIFETIME_MS) shapes.splice(i, 1);
      }

      const all = active ? [...shapes, active] : shapes;
      const t = now / 1000;

      for (const shape of all) {
        const age = now - shape.createdAt;
        let alpha = 1;
        if (age < FADE_IN_MS) {
          alpha = age / FADE_IN_MS;
        } else if (age > SHAPE_LIFETIME_MS - FADE_OUT_MS) {
          alpha = Math.max(0, (SHAPE_LIFETIME_MS - age) / FADE_OUT_MS);
        }

        // Gentle drift so finished shapes feel suspended rather than pinned.
        const dx = shape === active ? 0 : Math.sin(t * 0.4 + shape.driftSeed) * 4;
        const dy = shape === active ? 0 : Math.cos(t * 0.35 + shape.driftSeed) * 4;

        const pts = shape.points;

        ctx.strokeStyle = `rgba(6,182,212,${0.45 * alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < pts.length - 1; i++) {
          ctx.moveTo(pts[i].x + dx, pts[i].y + dy);
          ctx.lineTo(pts[i + 1].x + dx, pts[i + 1].y + dy);
        }
        ctx.stroke();

        for (const p of pts) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(165,180,252,${0.9 * alpha})`;
          ctx.arc(p.x + dx, p.y + dy, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // soft glow halo to match the ambient particle look
          ctx.beginPath();
          ctx.fillStyle = `rgba(99,102,241,${0.12 * alpha})`;
          ctx.arc(p.x + dx, p.y + dy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas!.removeEventListener('pointerdown', onPointerDown);
      canvas!.removeEventListener('pointermove', onPointerMove);
      canvas!.removeEventListener('pointerup', finishShape);
      canvas!.removeEventListener('pointerleave', finishShape);
      canvas!.removeEventListener('pointercancel', finishShape);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 cursor-crosshair"
      style={{ touchAction: 'none' }}
      data-testid="constellation-draw-canvas"
    />
  );
}
