import { Link } from "react-router-dom";
import { Search, FileText, MessageSquare, AlertCircle } from "lucide-react";
import InvestorShell from "@/components/investor/InvestorShell";
import StatCard from "@/components/ui/StatCard";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { filterStartups } from "@/api/startup/startupApi";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";

const _STATS = [
  {
    label: "Startups Available",
    value: "124",
    subtext: "+12% this month",
    trendDirection: "up",
  },
  { label: "Pitch Decks Received", value: "48", subtext: "Since last visit" },
  {
    label: "Active Conversations",
    value: "12",
    subtext: "+2 this week",
    trendDirection: "up",
  },
  { label: "Watchlist Count", value: "31", subtext: "Total items" },
];

// Removed hardcoded SUBMISSIONS

const STAGE_VARIANT = {
  Seed: "info",
  "Series A": "success",
  "Pre-Seed": "neutral",
};

const ALERTS = [
  {
    id: 1,
    title: "New Deck: SkyBound",
    desc: "Updated Series A deck with revised traction.",
    time: "12 mins ago",
  },
  {
    id: 2,
    title: "Updated: BioSynth",
    desc: "Phase 2 clinical data now available.",
    time: "1h ago",
  },
  {
    id: 3,
    title: "Shared: SolarNodes",
    desc: "Founder shared exclusive early access.",
    time: "4h ago",
  },
];

export default function InvestorPage() {
  useDocumentTitle("Investor Dashboard — BOCC");

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchlistStats, setWatchlistStats] = useState([]); // Remove hardcoded STATS init
  const [recommendations, setRecommendations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    Promise.all([
      filterStartups({}).catch((err) => ({ error: err })),
      api.get("/watchlist/statistics").catch((err) => ({ error: err })),
      api.get("/recommendations").catch((err) => ({ error: err })),
    ])
      .then(([res, statsRes, recsRes]) => {
        let hasError = false;

        if (res?.error) {
          hasError = true;
          setSubmissions([]);
        } else {
          const data = res.data || res || [];
          const mappedData = (Array.isArray(data) ? data : []).map((s) => ({
            id: s._id,
            name: s.startup_name || s.name || "Unknown",
            sector: s.industry || s.sector || "Unknown",
            stage: s.funding_stage || "Pre-Seed",
            submitted: new Date(s.createdAt || Date.now()).toLocaleDateString(),
          }));
          setSubmissions(mappedData.slice(0, 5));
        }

        if (statsRes?.error) {
          hasError = true;
          setWatchlistStats([]);
        } else if (statsRes && statsRes.data) {
          setWatchlistStats([
            {
              label: "Startups Available",
              value: statsRes.data.totalAvailable || "0",
              subtext: "Updated live",
            },
            {
              label: "Pitch Decks Received",
              value: statsRes.data.pitchDecks || "0",
              subtext: "Since last visit",
            },
            {
              label: "Active Conversations",
              value: statsRes.data.activeConversations || "0",
              subtext: "Active chats",
            },
            {
              label: "Watchlist Count",
              value: statsRes.data.watchlistCount || "0",
              subtext: "Total items",
            },
          ]);
        }

        if (recsRes?.error) {
          hasError = true;
          setRecommendations([]);
        } else if (recsRes && recsRes.data) {
          const recData = Array.isArray(recsRes.data) ? recsRes.data : [];
          const mappedRecs = recData.map((s) => ({
            id: s._id,
            name: s.startup_name || s.name || "Unknown",
            sector: s.industry || s.sector || "Unknown",
            stage: s.funding_stage || "Pre-Seed",
            submitted: "Recommended",
          }));
          setRecommendations(mappedRecs.slice(0, 5));
        }

        if (hasError) {
          const firstError = res?.error || statsRes?.error || recsRes?.error;
          setErrorMsg(
            firstError?.response?.data?.message ||
              firstError?.message ||
              "Failed to load some dashboard components. Data may be incomplete.",
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load dashboard data.",
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <InvestorShell>
      <section className="mb-8">
        <h1 className="font-poppins font-bold text-section text-text-heading mb-2">
          Welcome back, Marcus
        </h1>
        <p className="font-inter text-body text-text-muted mb-4">
          Here&apos;s what has happened since your last login.
        </p>

        {errorMsg && (
          <div className="p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {watchlistStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="flex flex-wrap gap-4 mb-8">
        <Link
          to="/investor/pitch-decks"
          className="inline-flex items-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <FileText size={16} strokeWidth={2} />
          View Pitch Decks
        </Link>
        <ComingSoon
          label="Browse Startups"
          position="top"
          inline
          className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-poppins font-semibold text-small px-5 py-2.5 rounded-md"
        >
          <Search size={16} strokeWidth={2} />
          Browse Startups
        </ComingSoon>
        <ComingSoon
          label="Open Conversations"
          position="top"
          inline
          className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-poppins font-semibold text-small px-5 py-2.5 rounded-md"
        >
          <MessageSquare size={16} strokeWidth={2} />
          Open Conversations
        </ComingSoon>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-card text-text-heading">
              Recent Startup Submissions
            </h2>
            <ComingSoon label="View All" position="top" inline>
              <span className="font-inter text-small font-medium text-text-body">
                View All
              </span>
            </ComingSoon>
          </div>
          <DataTable
            columns={[
              { key: "name", label: "Startup Name" },
              { key: "sector", label: "Sector", mobileLabel: false },
              {
                key: "stage",
                label: "Stage",
                render: (row) => (
                  <Badge variant={STAGE_VARIANT[row.stage] || "neutral"}>
                    {row.stage}
                  </Badge>
                ),
              },
              {
                key: "submitted",
                label: "Submitted",
                className: "text-text-muted",
              },
            ]}
            rows={
              loading
                ? []
                : recommendations.length > 0
                  ? recommendations
                  : submissions
            }
          />
        </div>

        <div className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
          <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">
            Pitch Deck Alerts
          </h2>
          <div className="flex flex-col gap-4">
            {ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 pb-4 border-b border-border-subtle last:border-0 last:pb-0"
              >
                <div className="w-9 h-9 rounded-md bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
                  <FileText
                    size={16}
                    strokeWidth={2}
                    className="text-text-muted"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-poppins font-semibold text-small text-text-heading truncate">
                    {alert.title}
                  </p>
                  <p className="font-inter text-small text-text-muted truncate">
                    {alert.desc}
                  </p>
                  <p className="font-inter text-caption text-text-muted mt-0.5">
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ComingSoon
            label="See all notifications"
            position="top"
            inline
            className="mt-4 inline-flex items-center gap-1 font-inter text-small font-medium"
          >
            See all notifications
          </ComingSoon>
        </div>
      </section>
    </InvestorShell>
  );
}
