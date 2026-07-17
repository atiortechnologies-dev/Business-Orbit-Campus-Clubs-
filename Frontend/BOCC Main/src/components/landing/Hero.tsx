import { motion } from "framer-motion";
import { Rocket, Users, Lightbulb, TrendingUp } from "lucide-react";
import logo from "../../assets/black_logo.png";

const stats = [
  { value: "500+", label: "Startups" },
  { value: "50+", label: "Campuses" },
  { value: "200+", label: "Mentors" },
  { value: "80+", label: "Investors" },
];

const orbit = [
  { icon: Rocket, angle: -60 },
  { icon: Lightbulb, angle: 180 },
  { icon: Users, angle: 20 },
  { icon: TrendingUp, angle: 100 },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight">
            Turn Ideas into Successful <span className="block">Startups</span>
          </h1>

          <p className="mt-6 text-neutral-600 max-w-lg leading-relaxed">
            Empowering the next generation of campus entrepreneurs with a curated
            platform of mentors, resources and industry partners.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#"
              className="bg-brand text-brand-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:brightness-95 transition-all shadow-sm"
            >
              Start Your Journey
            </a>

            <a
              href="#"
              className="border border-black/15 px-6 py-3 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors"
            >
              Explore Programs
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl px-4 py-3 border border-black/5"
              >
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Orbit */}
        <div className="relative aspect-square max-w-md mx-auto w-full">
          <motion.div
            className="absolute inset-0 rounded-full border border-black/10"
            animate={{ rotate: 360 }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <div className="absolute inset-8 rounded-full border border-black/10" />
          <div className="absolute inset-16 rounded-full border border-black/10" />

          {/* Center Logo - NO WHITE CIRCLE */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={logo}
              alt="BOCC Logo"
              className="w-64 h-64 object-contain select-none"
              draggable={false}
            />
          </div>

          {orbit.map(({ icon: Icon, angle }, i) => {
            const rad = (angle * Math.PI) / 180;
            const r = 45;
            const x = 50 + r * Math.cos(rad);
            const y = 50 + r * Math.sin(rad);

            return (
              <motion.div
                key={i}
                className="absolute w-12 h-12 bg-white rounded-full border border-black/10 flex items-center justify-center shadow-sm"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%,-50%)",
                }}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                <Icon size={18} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}