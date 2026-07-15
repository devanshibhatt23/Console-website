import { useRef, MouseEvent, ReactNode } from 'react';
import Tilt from 'react-parallax-tilt';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string; // e.g. "rgba(242, 153, 74, 0.12)"
  borderColor?: string;     // e.g. "rgba(242, 153, 74, 0.35)"
  tiltMaxAngle?: number;
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(242, 153, 74, 0.12)',
  borderColor = 'rgba(242, 153, 74, 0.35)',
  tiltMaxAngle = 6,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty('--mouse-x', `${x}px`);
    container.style.setProperty('--mouse-y', `${y}px`);
  }

  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.06}
      glareColor="#ffffff"
      glarePosition="all"
      tiltMaxAngleX={tiltMaxAngle}
      tiltMaxAngleY={tiltMaxAngle}
      className="h-full"
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`spotlight-card-wrapper h-full ${className}`}
        style={{
          ['--spotlight-color' as any]: spotlightColor,
          ['--spotlight-border-color' as any]: borderColor,
        }}
      >
        {/* Glow spotlight element */}
        <div className="spotlight-card-glow" />

        {/* Animated border outline */}
        <div className="spotlight-card-border-glow" />

        {/* Content */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </Tilt>
  );
}
