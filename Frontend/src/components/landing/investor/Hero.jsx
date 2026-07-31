import { Link } from "react-router-dom";
import { ArrowRight, LineChart } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";

const STATS = [
  { value: "500+", label: "Pre-Vetted Student Startups" },
  { value: "$12M+", label: "Capital Facilitated" },
  { value: "45%", label: "Avg. Startup Growth Rate" },
];

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-28 pb-24 md:pt-32 md:pb-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-start">
        <div className="max-w-xl">
          <span className="inline-flex items-center rounded-full border border-border-subtle px-3 py-1 font-inter text-caption font-medium text-text-muted">
            For Investors &amp; Venture Partners
          </span>

          <h1 className="mt-6 font-poppins font-bold text-5xl leading-[1.05] tracking-tight text-text-heading md:text-6xl">
            Identify and Invest in the Next Generation of Campus Founders
          </h1>

          <p className="mt-6 font-inter text-body md:text-[17px] leading-relaxed text-text-body">
            BOCC connects visionary investors with carefully vetted student
            startups emerging from leading universities. Gain early access to
            innovative ventures, review investment-ready opportunities, and
            support the next generation of entrepreneurs through the BOCC
            ecosystem.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup/investor"
              className="group inline-flex items-center gap-2 rounded-md bg-action-bg px-5 py-3 font-inter text-small font-semibold text-action-text hover:opacity-90 transition-all"
            >
              Join as an Investor
              <ArrowRight
                size={16}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <ComingSoon
              label="View Startup Directory"
              position="top"
              inline
              className="inline-flex items-center rounded-md border border-border-subtle bg-surface-white px-5 py-3 font-inter text-small font-medium text-text-heading"
            >
              View Startup Directory
            </ComingSoon>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border-subtle pt-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-poppins font-bold text-3xl md:text-4xl text-text-heading">
                  {s.value}
                </div>
                <div className="mt-1 font-inter text-[11px] uppercase tracking-wider text-text-muted">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <PlaceholderGraphic
            icon={LineChart}
            label="Investment Dashboard"
            className="aspect-[4/3] rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
