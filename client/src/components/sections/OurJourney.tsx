import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Real CONSOLE Event History Data (directly synced with Events Page)
// Removed Recruitment card and replaced it with CONCODE as the final (5th) card at 130vw.
const CONSOLE_JOURNEY_DATA = [
  {
    id: 'e1',
    date: 'SEP 6, 2025',
    title: 'CONSOLE Orientation',
    desc: 'Official orientation session welcoming new freshers and coders to CONSOLE MNIT.',
    bgColor: '#FACC15', // Minecraft Gold
    textColor: '#000000',
    clipPosition: 'left',
    rotation: '-4deg',
    leftPos: '10vw',
    topPos: '16%',
  },
  {
    id: 'e2',
    date: 'OCT 13, 2025',
    title: 'AI × Programming',
    desc: 'Exploring machine learning, prompt engineering, and modern AI tools for developers.',
    bgColor: '#F0405C', // Minecraft Redstone
    textColor: '#FFFFFF',
    clipPosition: 'right',
    rotation: '3deg',
    leftPos: '40vw',
    topPos: '60%',
  },
  {
    id: 'e3',
    date: 'JAN 17, 2026',
    title: 'Confluence 2026',
    desc: 'Building the foundation of thoughtful learning where teams solved challenges through discussion, reasoning, and key mindset pillars.',
    bgColor: '#0EA5E9', // Minecraft Diamond Cyan
    textColor: '#000000',
    clipPosition: 'left',
    rotation: '-3deg',
    leftPos: '70vw',
    topPos: '16%',
  },
  {
    id: 'e4',
    date: 'FEB 14, 2026',
    title: 'Git-Wars Workshop',
    desc: 'A hands-on Git & open-source workshop where participants learned version control and shipped real pull requests.',
    bgColor: '#10B981', // Minecraft Emerald Green
    textColor: '#FFFFFF',
    clipPosition: 'right',
    rotation: '4deg',
    leftPos: '100vw',
    topPos: '60%',
  },
  {
    id: 'e5',
    date: 'APR 11, 2026',
    title: 'CONCODE',
    desc: "Console Club's flagship 24-hour hackathon, bringing together passionate first-year students to innovate, collaborate, and build impactful projects.",
    bgColor: '#F2994A', // Minecraft Blaze Orange
    textColor: '#000000',
    clipPosition: 'left',
    rotation: '-3deg',
    leftPos: '130vw',
    topPos: '16%',
  },
];

// Metallic Paperclip SVG graphic to create realistic "clipped on" look
function Paperclip({ isRight = false }: { isRight?: boolean }) {
  return (
    <svg
      width="20"
      height="36"
      viewBox="0 0 24 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute -top-4.5 ${isRight ? 'right-4' : 'left-4'} z-30 drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)] pointer-events-none`}
    >
      <path
        d="M8 36V10C8 6.02944 10.4183 3.6 13.4 3.6C16.3817 3.6 18.8 6.02944 18.8 10V32C18.8 36.4183 15.4183 40 11 40C6.58172 40 3 36.4183 3 32V14"
        stroke="#94A3B8"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M8 36V10C8 6.02944 10.4183 3.6 13.4 3.6C16.3817 3.6 18.8 6.02944 18.8 10V32C18.8 36.4183 15.4183 40 11 40C6.58172 40 3 36.4183 3 32V14"
        stroke="#F1F5F9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 12V10C8 7 10 5 13 5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default function OurJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Smooth scroll tracking across 280vh section height
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Direct, smooth horizontal translation - completes translation earlier (at 0.88 progress) to bypass page-end scroll limits
  const x = useTransform(scrollYProgress, [0, 0.88], ['0%', '-64%']);

  return (
    <section ref={sectionRef} className="relative h-[280vh] bg-black select-none">
      {/* Import authentic Minecraft fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
        
        .font-minecraft {
          font-family: 'Press Start 2P', monospace;
        }
        .font-minecraft-body {
          font-family: 'VT323', monospace;
        }
      `}</style>

      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        {/* Floating Top-Left Minecraft Badge */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-orange-500/10 border-2 border-orange-500/40 text-orange-400 font-minecraft text-[10px] md:text-xs tracking-wider uppercase shadow-xl backdrop-blur-md mb-5">
            <span className="w-2.5 h-2.5 rounded-none bg-orange-400 animate-pulse" />
            CONSOLE ARCHIVES
          </div>
        </div>

        {/* Ambient background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none blur-[180px] opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(242,153,74,0.2) 0%, rgba(14,165,233,0.08) 50%, transparent 100%)' }}
        />

        {/* Horizontally Animated Track */}
        <motion.div style={{ x }} className="flex items-center relative w-[190vw] h-full will-change-transform pr-[15vw]">
          
          {/* Giant "OUR JOURNEY" Background Typography in Menseal Font */}
          <div
            className="absolute top-1/2 left-[5vw] -translate-y-1/2 flex items-center leading-none pointer-events-none font-bold tracking-tight whitespace-nowrap text-[17.5vw] md:text-[21.5vw] text-transparent bg-clip-text z-0 select-none uppercase"
            style={{
              fontFamily: "'Menseal', sans-serif",
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(140,140,140,0.55) 100%)',
              filter: 'drop-shadow(0 0 35px rgba(255,255,255,0.15))',
              lineHeight: 1,
            }}
          >
            OUR JOURNEY
          </div>

          {/* Milestone Clipped Minecraft Tags */}
          {CONSOLE_JOURNEY_DATA.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.06, zIndex: 40, y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute z-20 p-2.5 md:p-3 rounded-lg shadow-2xl cursor-pointer w-[170px] md:w-[190px] border-2 border-black/40 backdrop-blur-sm"
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
                transform: `rotate(${item.rotation})`,
                left: item.leftPos,
                top: item.topPos,
                boxShadow: '0 14px 35px rgba(0,0,0,0.65)',
              }}
            >
              {/* Metallic Paperclip Overlay */}
              <Paperclip isRight={item.clipPosition === 'right'} />

              {/* Date Header */}
              <div className="font-minecraft text-[6px] md:text-[7px] font-bold tracking-wider opacity-90 underline decoration-black/40 mb-1.5 uppercase">
                {item.date}
              </div>

              {/* Milestone Title */}
              <div className="font-minecraft text-[8px] md:text-[9px] font-bold leading-snug uppercase mb-1.5">
                {item.title}
              </div>

              {/* Description */}
              <div className="font-minecraft-body text-xs md:text-xs leading-snug opacity-95 font-medium">
                {item.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
