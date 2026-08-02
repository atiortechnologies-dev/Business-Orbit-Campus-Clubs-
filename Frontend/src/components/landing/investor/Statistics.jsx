import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 92, suffix: '%', label: 'Startup Graduation Rate' },
  { value: 120, suffix: '+', label: 'Industry Mentors' },
  { value: 15, suffix: '+', label: 'Partner Universities' },
  { value: 2.4, prefix: '$', suffix: 'M', label: 'Average Investment Facilitated', decimals: 1 },
];

// Same "count up once visible" effect as the original, just without
// framer-motion's useInView — a plain IntersectionObserver does the exact
// same job for a one-shot trigger like this.
function Counter({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const duration = 1400;
      const start = performance.now();
      let raf = 0;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

export default function Statistics() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-poppins font-bold text-4xl md:text-5xl tracking-tight text-text-heading">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="mt-2 font-inter text-[11px] uppercase tracking-wider text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
