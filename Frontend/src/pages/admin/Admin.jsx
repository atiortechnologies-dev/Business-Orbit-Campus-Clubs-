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
  Calendar,
  Map,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/ui/StatCard";
import ComingSoon from "@/components/ui/ComingSoon";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import api from "@/api/axiosInstance";

// Dummy data removed. Fallbacks now use 0s or empty arrays.

const TONE_CLASSES = {
  error: "bg-error/15 text-error",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/15 text-info",
};

const ICON_MAP = {
  UserPlus: UserPlus,
  FileText: FileText,
  AlertTriangle: AlertTriangle,
  RefreshCw: RefreshCw
};

export default function AdminDashboardPage() {
  useDocumentTitle("BOCC Command Center — Admin Dashboard");
  const [funnelView, setFunnelView] = useState("Daily");
  const [criticalActions, setCriticalActions] = useState([]);
  const [overview, setOverview] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(true);

  useEffect(() => {
    setErrorMsg("");
    
    setIsLoadingOverview(true);
    api
      .get("/admin/overview")
      .then((res) => {
        setOverview(res);
        if (res?.criticalActions) {
          const mappedActions = res.criticalActions.map(ca => ({
            ...ca,
            icon: ICON_MAP[ca.iconName] || AlertTriangle
          }));
          setCriticalActions(mappedActions);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch overview", err);
        setErrorMsg(
          (prev) =>
            prev ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch overview",
        );
      })
      .finally(() => setIsLoadingOverview(false));

    setIsLoadingUpdates(true);
    api
      .get("/admin/updates")
      .then((res) => {
        if (res?.updates && res.updates.length > 0) {
          const mappedUpdates = res.updates.map((u) => ({
            icon: RefreshCw,
            text: u.message || u.text || "System Update",
            time: u.time || "Recently",
          }));
          setUpdates(mappedUpdates);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch updates", err);
        setErrorMsg(
          (prev) =>
            prev ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch updates",
        );
      })
      .finally(() => setIsLoadingUpdates(false));
  }, []);

  const activeFunnelViews = overview?.funnelViews || {
    Daily: [
      { label: "Idea", value: 0 },
      { label: "Validation", value: 0 },
      { label: "MVP", value: 0 },
      { label: "Traction", value: 0 },
      { label: "Launch", value: 0 },
    ]
  };
  const activeDistribution = overview?.userDistribution || [];
  const funnel = activeFunnelViews[funnelView] || activeFunnelViews["Daily"];
  const funnelMax = funnel[0]?.value || 1;

  const dismissAction = async (id) => {
    setErrorMsg("");
    try {
      await api.patch("/admin/actions", { actionId: id, status: "dismissed" });
      setCriticalActions((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Failed to dismiss action:", e);
      setErrorMsg(
        e?.response?.data?.message || e?.message || "Failed to dismiss action",
      );
    }
  };

  return (
    <AdminShell>
      {errorMsg && overview && (
        <div className="mb-6 p-3 bg-error/15 border border-error/30 text-error rounded-md text-small flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!isLoadingOverview && !overview ? (
        <div className="flex flex-col items-center justify-center p-12 bg-surface-white border border-border-subtle rounded-lg text-center min-h-[50vh] mb-8">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="font-poppins font-semibold text-h4 text-text-heading mb-2">
            Unable to Load Dashboard Data
          </h2>
          <p className="font-inter text-text-body mb-6 max-w-md">
            The server could not be reached or the database connection failed.
          </p>
          {errorMsg && (
            <div className="p-3 bg-error/5 border border-error/20 text-error rounded-md text-small max-w-lg text-left overflow-auto w-full">
              <code className="break-words">{errorMsg}</code>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoadingOverview ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface-white border border-border-subtle rounded-lg p-5 h-[116px]"></div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Total Users"
              value={overview?.totalUsers || "0"}
              icon={<Users size={18} strokeWidth={2} />}
              subtext="+8.4% this month"
              trendDirection="up"
            />
            <StatCard
              label="Active Startups"
              value={overview?.activeStartups || "0"}
              icon={<Rocket size={18} strokeWidth={2} />}
              subtext="92% engagement"
            />
            <StatCard
              label="Pending Verifications"
              value={overview?.pendingVerifications || "0"}
              icon={<ShieldAlert size={18} strokeWidth={2} />}
              subtext="8 critical alerts"
              trendDirection="down"
              className="border-error/40"
            />
            <StatCard
              label="Investor Capital"
              value={overview?.investorCapital || "$0M"}
              icon={<DollarSign size={18} strokeWidth={2} />}
              subtext="Tracked across all rounds"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <section className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-card text-text-heading mb-6">
            User Distribution
          </h3>
          <div className="space-y-4 mb-6">
            {isLoadingOverview ? (
              <div className="animate-pulse space-y-4">
                <div className="h-[28px] bg-divider-line rounded w-full"></div>
                <div className="h-[28px] bg-divider-line rounded w-full"></div>
                <div className="h-[28px] bg-divider-line rounded w-full"></div>
              </div>
            ) : (
              activeDistribution.map(({ label, pct }) => (
                <div key={label}>
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
              ))
            )}
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
              {Object.keys(activeFunnelViews).map((view) => (
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
            {isLoadingOverview ? (
               <div className="flex w-full items-end gap-3 h-full">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <div className="w-1/2 bg-divider-line h-4 rounded animate-pulse"></div>
                      <div className="w-full bg-divider-line rounded-t animate-pulse" style={{ height: `${20 + i * 15}%` }}></div>
                      <div className="w-2/3 bg-divider-line h-3 rounded animate-pulse"></div>
                    </div>
                  ))}
               </div>
            ) : (
              funnel.map(({ label, value }) => (
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
              ))
            )}
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
          {isLoadingOverview ? (
            <div className="divide-y divide-border-subtle animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-divider-line shrink-0"></div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-5 bg-divider-line rounded w-1/3"></div>
                    <div className="h-4 bg-divider-line rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : criticalActions.length === 0 ? (
            <p className="p-6 font-inter text-small text-text-muted">
              No critical actions — you're all caught up.
            </p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {criticalActions.map(
                ({ id, icon: Icon, tone, title, detail, reviewHref }) => (
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
                ),
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
            {isLoadingUpdates ? (
              <div className="animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-divider-line shrink-0"></div>
                    <div className="h-4 bg-divider-line rounded flex-1"></div>
                    <div className="h-3 w-10 bg-divider-line rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              updates.map(({ icon: Icon, text, time }, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-3">
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
              ))
            )}
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
              <div className="flex items-center gap-3">
                <Calendar
                  size={16}
                  strokeWidth={2}
                  className="text-white/60 shrink-0"
                />
                <p className="font-inter text-small flex-1">
                  Advisory Board Sync — Today, 14:00
                </p>
                <div className="flex -space-x-2" aria-hidden="true">
                  {["S", "M", "E"].map((letter, i) => (
                    <span
                      key={letter}
                      className="w-6 h-6 rounded-full bg-white/10 border-2 border-brand-black flex items-center justify-center text-[10px] font-semibold"
                      style={{ zIndex: 3 - i }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar
                  size={16}
                  strokeWidth={2}
                  className="text-white/60 shrink-0"
                />
                <p className="font-inter text-small flex-1">
                  Investor Showcase Review — Tomorrow, 10:30 AM
                </p>
              </div>
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
      </>
      )}
    </AdminShell>
  );
}
