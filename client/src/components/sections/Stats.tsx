import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const stats = [
  { label: 'Active Members', value: 350, suffix: '+' },
  { label: 'Events Hosted', value: 42, suffix: '' },
  { label: 'Projects Built', value: 128, suffix: '+' },
  { label: 'Lines of Code', value: 1.5, suffix: 'M+' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        onEnter: () => {
          if (!hasAnimated) {
            setHasAnimated(true);
            numbersRef.current.forEach((el, index) => {
              if (el) {
                const targetVal = stats[index].value;
                gsap.to(el, {
                  innerHTML: targetVal,
                  duration: 2.5,
                  ease: 'power3.out',
                  snap: { innerHTML: targetVal % 1 !== 0 ? 0.1 : 1 },
                  onUpdate: function() {
                    // Add decimal point logic if needed for 1.5M
                    if (targetVal % 1 !== 0) {
                      el.innerHTML = Number(this.targets()[0].innerHTML).toFixed(1);
                    }
                  }
                });
              }
            });
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 border-y border-white/5 bg-card/30 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono text-white mb-2 flex items-baseline">
                <span ref={(el) => { numbersRef.current[index] = el; }}>0</span>
                <span className={index % 2 === 0 ? "text-primary" : "text-secondary"}>{stat.suffix}</span>
              </div>
              <div className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
