import { motion, useReducedMotion } from 'framer-motion';

/**
 * @param {{
 *   children: import("react").ReactNode;
 *   delay?: number;
 *   y?: number;
 *   className?: string;
 * }} props
 */
export default function FadeIn({ children, delay = 0, y = 24, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}