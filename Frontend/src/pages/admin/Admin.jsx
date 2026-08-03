import { useState, useEffect } from "react";
import {
  Users,
  Rocket,
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  FileText,
  UserPlus,
  ArrowRight,
  RefreshCw,
  Upload,
  FolderPlus,
  Calendar,
  Map,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getAdminOverview } from "@/api/admin/adminDashboardApi";

const ICON_MAP = {
  AlertTriangle,
  FileText,
  UserPlus,
  RefreshCw,
  Upload,
  FolderPlus,
};

const TONE_CLASSES = {
  error: "bg-error/15 text-error",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
};

export default function AdminDashboardPage() {
  useDocumentTitle("BOCC Command Center — Admin Dashboard");
  const [funnelView, setFunnelView] = useState("Daily");
  const [dismissedActions, setDismissedActions] = useState([]);

  // Fetching state
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Making standard axios call (or call your api helper function)
        const res = await getAdminOverview();

        if (isMounted) {
          // If your axios response interceptor returns response.data directly:
          setOverview(res.data || res);
        }
      } catch (error) {
        console.error("Failed to fetch admin overview:", error);
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="animate-spin text-text-muted" size={48} />
        </div>
      </AdminShell>
    );
  }

  if (isError || !overview) {
    return (
      <AdminShell>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertTriangle className="text-error mb-4" size={48} />
          <h2 className="text-text-heading font-poppins font-semibold text-xl mb-2">
            Failed to load overview
          </h2>
          <p className="text-text-muted font-inter">
            Please try refreshing the page.
          </p>
        </div>
      </AdminShell>
    );
  }

  const funnel =
    overview.funnelViews?.[funnelView] || overview.funnelViews?.["Daily"] || [];
  const funnelMax = Math.max(...funnel.map((f) => f.value), 1);

  const dismissAction = (id) => setDismissedActions((prev) => [...prev, id]);
  const criticalActions = (overview.criticalActions || []).filter(
    (a) => !dismissedActions.includes(a.id),
  );

  return (
    <AdminShell>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Users"
          value={overview.totalUsers?.toLocaleString() || 0}
          icon={<Users size={18} strokeWidth={2} />}
          subtext="Platform total"
          trendDirection="up"
        />
        <StatCard
          label="Active Startups"
          value={overview.activeStartups?.toLocaleString() || 0}
          icon={<Rocket size={18} strokeWidth={2} />}
          subtext="Registered ideas"
        />
        <StatCard
          label="Pending Verifications"
          value={overview.pendingVerifications?.toLocaleString() || 0}
          icon={<ShieldAlert size={18} strokeWidth={2} />}
          subtext="Action required"
          trendDirection="down"
          className={overview.pendingVerifications > 0 ? "border-error/40" : ""}
        />
        <StatCard
          label="Investor Capital"
          value={overview.investorCapital || "$0"}
          icon={<DollarSign size={18} strokeWidth={2} />}
          subtext="Tracked across all rounds"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <section className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-card text-text-heading mb-6">
            User Distribution
          </h3>
          <div className="space-y-4 mb-6">
            {(overview.userDistribution || []).map(({ label, pct, count }) => (
              <div key={label} title={`${count} Users`}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-inter text-small text-text-body">
                    {label}
                  </span>
                  <span className="font-inter font-semibold text-small text-text-heading">
                    {pct}%
                  </span>
                </div>
                <div className="w-full bg-divider-line h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-black h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ComingSoon label="Demographic Map" position="top">
            <div className="w-full h-32 rounded-lg border-2 border-dashed border-border-subtle bg-canvas-bg flex flex-col items-center justify-center gap-1.5">
              <Map size={20} strokeWidth={2} className="text-text-muted" />
              <span className="font-inter text-caption text-text-muted">
                Demographic Map
              </span>
            </div>
          </ComingSoon>
        </section>

        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-semibold text-card text-text-heading">
              Startup Journey Funnel
            </h3>
            <div className="flex items-center gap-1 bg-canvas-bg rounded-md p-1">
              {Object.keys(overview.funnelViews || {}).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setFunnelView(view)}
                  className={`px-3 py-1 rounded font-inter font-medium text-caption transition-colors ${
                    funnelView === view
                      ? "bg-surface-white text-text-heading shadow-sm"
                      : "text-text-muted hover:text-text-heading"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-32 mb-3">
            {funnel.map(({ label, value }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
              >
                <span className="font-inter font-semibold text-caption text-text-heading">
                  {value.toLocaleString()}
                </span>
                <div
                  className="w-full bg-brand-black rounded-t transition-all"
                  style={{
                    height: `${Math.max((value / funnelMax) * 100, 4)}%`,
                  }}
                />
                <span className="font-inter text-caption text-text-muted">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-divider-line">
            <div className="flex gap-6">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">
                  Conversion Rate
                </p>
                <p className="font-poppins font-semibold text-body text-text-heading">
                  3.4%
                </p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">
                  Avg. Time to MVP
                </p>
                <p className="font-poppins font-semibold text-body text-text-heading">
                  114 Days
                </p>
              </div>
            </div>
            <ComingSoon label="Drop-off report" position="top" inline>
              <span className="flex items-center gap-1 font-inter font-medium text-small text-text-body hover:text-text-heading transition-colors">
                View detailed drop-off report{" "}
                <ArrowRight size={14} strokeWidth={2} />
              </span>
            </ComingSoon>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
            <h3 className="font-poppins font-semibold text-card text-text-heading">
              Critical Actions
            </h3>
          </div>
          {criticalActions.length === 0 ? (
            <p className="p-6 font-inter text-small text-text-muted">
              No critical actions — you're all caught up.
            </p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {criticalActions.map(
                ({ id, iconType, tone, title, detail, reviewHref }) => {
                  const Icon = ICON_MAP[iconType] || AlertTriangle;
                  return (
                    <div key={id} className="p-6 flex items-start gap-4">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-inter font-semibold text-body text-text-heading">
                          {title}
                        </p>
                        <p className="font-inter text-small text-text-muted">
                          {detail}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {reviewHref && (
                          <Link
                            to={reviewHref}
                            className="px-3 py-1.5 bg-action-bg text-action-text rounded-md font-inter font-medium text-caption hover:opacity-90 transition-opacity"
                          >
                            Review
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => dismissAction(id)}
                          className="px-3 py-1.5 border border-border-subtle rounded-md font-inter font-medium text-caption text-text-muted hover:bg-canvas-bg hover:text-text-heading transition-colors"
                        >
                          Ignore
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </section>

        <section className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
            <h3 className="font-poppins font-semibold text-card text-text-heading">
              Activity Stream
            </h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {(overview.activityStream || []).map(({ iconType, text, time }) => {
              const Icon = ICON_MAP[iconType] || RefreshCw;
              return (
                <div key={text} className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center text-text-muted shrink-0">
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <p className="flex-1 font-inter text-small text-text-body">
                    {text}
                  </p>
                  <span className="font-inter text-caption text-text-muted whitespace-nowrap">
                    {time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="bg-brand-black text-white rounded-lg p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-card mb-4">
              Upcoming Cycle
            </h3>
            <div className="space-y-3">
              {(overview.upcomingCycle || []).length > 0 ? (
                overview.upcomingCycle.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Calendar
                      size={16}
                      strokeWidth={2}
                      className="text-white/60 shrink-0"
                    />
                    <p className="font-inter text-small flex-1">
                      {m.title} —{" "}
                      {new Date(m.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-inter text-small text-white/60">
                  No upcoming meetings scheduled.
                </p>
              )}
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <div className="flex justify-between mb-1.5">
              <span className="font-inter text-caption text-white/70 uppercase tracking-wider">
                System Integrity
              </span>
              <span className="font-inter font-semibold text-caption">
                99.98%
              </span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-accent-neon h-full rounded-full"
                style={{ width: "99.98%" }}
              />
            </div>
            <p className="font-inter text-caption text-white/50 mt-1.5">
              Uptime, last 30 days
            </p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
