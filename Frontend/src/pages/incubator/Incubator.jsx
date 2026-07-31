import { Link } from "react-router-dom";
import {
  TrendingUp,
  Hourglass,
  Rocket,
  Calendar,
  ChevronRight,
} from "lucide-react";
import IncubatorShell from "@/components/incubator/IncubatorShell";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const STATS = [
  {
    label: "New Applications",
    value: "12",
    icon: TrendingUp,
    subtext: "+2 this week",
  },
  {
    label: "Under Review",
    value: "8",
    icon: Hourglass,
    subtext: "4 awaiting feedback",
  },
  {
    label: "Incubated Startups",
    value: "24",
    icon: Rocket,
    subtext: "Across 4 cohorts",
  },
  {
    label: "Upcoming Meetings",
    value: "3",
    icon: Calendar,
    subtext: "Next: Tomorrow 10 AM",
  },
];

const RECENT_ACTIVITY = [
  {
    name: "QuantumFlow AI",
    meta: "SaaS • Pre-Seed",
    status: "Pitch Deck Shared",
    time: "2h ago",
  },
  {
    name: "GreenRoot Logistics",
    meta: "AgriTech • Series A",
    status: "In Review",
    time: "5h ago",
  },
  {
    name: "Nexus Health",
    meta: "HealthTech • Seed",
    status: "New Submission",
    time: "Yesterday",
  },
  {
    name: "Aura Fintech",
    meta: "FinTech • Pre-Seed",
    status: "Pending Mentor Assignment",
    time: "2 days ago",
  },
];

const PENDING_REVIEWS = ["CloudScale", "BioSynth", "UrbanIQ"];

const RECENTLY_INCUBATED = [
  { name: "SolarPulse", date: "Joined Oct 2023" },
  { name: "HydroNode", date: "Joined Sep 2023" },
  { name: "VocalSync", date: "Joined Aug 2023" },
];

export default function IncubatorDashboard() {
  useDocumentTitle("Incubator Dashboard — BOCC");
  return (
    <IncubatorShell>
      <section className="mb-8">
        <h1 className="font-poppins font-bold text-section text-text-heading mb-2">
          Welcome back,
        </h1>
        <p className="text-text-muted font-inter text-body">
          Here's what's happening in your incubator ecosystem today.
        </p>
      </section>

      <section className="flex flex-wrap gap-4 mb-8">
        <Link to="/incubator/applications">
          <button className="px-6 py-2.5 bg-action-bg text-action-text rounded-md font-poppins font-semibold text-small hover:opacity-90 active:scale-[0.98] transition-all">
            Review Applications
          </button>
        </Link>

        <ComingSoon label="View Startup Tracker" position="bottom" inline>
          <span className="px-6 py-2.5 bg-surface-white border border-border-subtle text-text-heading rounded-md font-poppins font-semibold text-small block text-center">
            View Startup Tracker
          </span>
        </ComingSoon>

        <ComingSoon label="Schedule Reviews" position="bottom" inline>
          <span className="px-6 py-2.5 bg-surface-white border border-border-subtle text-text-heading rounded-md font-poppins font-semibold text-small block text-center">
            Schedule Reviews
          </span>
        </ComingSoon>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {STATS.map(({ label, value, icon: Icon, subtext }) => (
          <div
            key={label}
            className="bg-surface-white border border-border-subtle p-6 rounded-xl shadow-card transition-colors duration-150 ease-linear"
          >
            <p className="text-text-muted font-poppins font-semibold text-caption uppercase tracking-wider mb-2">
              {label}
            </p>
            <h3 className="font-poppins font-bold text-section text-text-heading mb-2">
              {value}
            </h3>
            <div className="flex items-center gap-1.5 text-text-muted text-xs">
              <Icon size={16} strokeWidth={2} />
              <span className="font-inter font-normal">{subtext}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden transition-colors duration-150 ease-linear">
          <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-canvas-bg/50">
            <h4 className="font-poppins font-bold text-card text-text-heading">
              Recent Application Activity
            </h4>
            <Link
              to="/incubator/applications"
              className="text-text-muted hover:text-text-heading font-poppins font-semibold text-small transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {RECENT_ACTIVITY.map(({ name, meta, status, time }) => (
              <div
                key={name}
                className="p-6 flex items-center justify-between hover:bg-canvas-bg/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      {name}
                    </p>
                    <p className="text-text-muted font-inter text-xs">{meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[11px] font-poppins font-semibold text-text-muted uppercase tracking-wider">
                      Status
                    </p>
                    <p className="font-inter text-small text-text-heading">
                      {status}
                    </p>
                  </div>
                  <span className="text-text-muted font-inter text-xs whitespace-nowrap">
                    {time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden transition-colors duration-150 ease-linear">
            <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-canvas-bg/50">
              <h4 className="font-poppins font-semibold text-small text-text-heading">
                Pending Reviews
              </h4>
              <span className="bg-brand-black text-white px-2 py-0.5 rounded text-[11px] font-poppins font-bold select-none dark:bg-canvas-bg dark:text-text-heading">
                {PENDING_REVIEWS.length}
              </span>
            </div>
            <div className="p-4 space-y-3">
              {PENDING_REVIEWS.map((name) => (
                <div
                  key={name}
                  className="p-3 border border-border-subtle rounded-lg flex items-center justify-between hover:bg-canvas-bg/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-xs select-none">
                      {name.charAt(0)}
                    </div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      {name}
                    </p>
                  </div>
                  <Link to="/incubator/applications">
                    <button className="px-3 py-1 bg-action-bg text-action-text rounded font-poppins font-semibold text-xs hover:opacity-90 active:scale-[0.98] transition-all">
                      Review
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden transition-colors duration-150 ease-linear">
            <div className="p-4 border-b border-border-subtle bg-canvas-bg/50">
              <h4 className="font-poppins font-semibold text-small text-text-heading">
                Recently Incubated
              </h4>
            </div>
            <ul className="divide-y divide-border-subtle">
              {RECENTLY_INCUBATED.map(({ name, date }) => (
                <li
                  key={name}
                  className="p-4 flex items-center gap-3 hover:bg-canvas-bg/20 transition-colors"
                >
                  <div className="w-6 h-6 rounded bg-canvas-bg border border-border-subtle flex items-center justify-center font-bold text-text-heading text-[10px] select-none">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">
                      {name}
                    </p>
                    <p className="text-text-muted font-inter text-xs">{date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </IncubatorShell>
  );
}
