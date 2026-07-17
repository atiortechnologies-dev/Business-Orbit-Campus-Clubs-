import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal — returns a ref; elements with [data-reveal] inside
 * fade/slide in when they enter the viewport.
 */
export function useScrollReveal(variant = "stagger") {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = ref.current || document;
    const els = /** @type {NodeListOf<HTMLElement>} */ (
      root.querySelectorAll("[data-reveal]")
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform =
        variant === "up" ? "translateY(24px)" : "translateY(20px)";
      el.style.transition =
        "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = /** @type {HTMLElement} */ (entry.target);
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : i * 80;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mounted, variant]);

  return ref;
}