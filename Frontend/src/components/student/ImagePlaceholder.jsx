import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ImagePlaceholder({ className, label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative flex items-center justify-center bg-neutral-100 border border-neutral-200 rounded-sm aspect-[4/3] w-full",
        className
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full text-neutral-300"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        fill="none"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.3" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.3" />
      </svg>
      {label && (
        <span className="relative z-10 text-xs font-medium tracking-wide text-neutral-400 uppercase">
          {label}
        </span>
      )}
    </motion.div>
  );
}