import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  Rocket,
  Lock,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Inbox,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import Badge from "@/components/ui/Badge";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getStartupById } from "@/api/admin/adminStartupApi";

// Real BOCC program stages (Backend/utils/stageDefinitions.js) — the one
// taxonomy this app uses for a startup's journey, same as ChapterDetail.jsx's
// Startups tab, Review Queue, IdeationReview, and Meetings.
const STAGE_LABELS = ["Ideation", "Validation", "MVP", "Traction", "Launch & Pitch"];

const STAGE_STATUS_META = {
  locked: { label: "Locked", variant: "neutral", icon: Lock },
  active: { label: "In Progress", variant: "info", icon: Clock },
  submitted: { label: "Submitted", variant: "warning", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "error", icon: XCircle },
};

export default function StartupDetailPage() {
  useDocumentTitle("Startup Details — BOCC Admin");
  const [searchParams] = useSearchParams();
  const startupId = searchParams.get("id");

  const [startup, setStartup] = useState(null);
  const [journeyStages, setJourneyStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStartup = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        if (!startupId) {
          setIsError(true);
          return;
        }

        // TODO(backend): GET /admin/startups/:id doesn't exist yet — see
        // adminStartupApi.js's getStartupById for the expected response
        // shape (startup context + journeyStages, mirroring
        // getSubmissionDetail's existing journeyStages computation with a
        // submissionId added per stage).
        const res = await getStartupById(startupId);
        const payload = res?.data?.data || res?.data || res;

        if (isMounted && payload) {
          setStartup(payload.startup);
          setJourneyStages(payload.journeyStages || []);
        }
      } catch (err) {
        console.error("Failed to load startup details:", err);
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStartup();

    return () => {
      isMounted = false;
    };
  }, [startupId]);

  if (isLoading) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 size={28} className="animate-spin text-text-muted" />
        </div>
      </AdminShell>
    );
  }

  if (isError || !startup) {
    return (
      <AdminShell>
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-3">
          <Inbox size={32} className="text-text-muted" />
          <p className="font-poppins font-semibold text-card text-text-heading">
            Couldn't load this startup
          </p>
          <p className="font-inter text-small text-text-muted max-w-sm">
            This startup's details aren't available or the link is invalid.
          </p>
          <Link
            to="/admin/chapters"
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Back to Chapters
          </Link>
        </div>
      </AdminShell>
    );
  }

  // Fall back to a plain 5-row skeleton (all locked) if the backend hasn't
  // returned journeyStages yet, so the section still renders sensibly.
  const stages =
    journeyStages.length > 0
      ? journeyStages
      : STAGE_LABELS.map((label, i) => ({
          stageNumber: i + 1,
          label,
          status: "locked",
          submissionId: null,
        }));

  // No standalone /admin/startups directory exists — Startup Detail is
  // reached only from a chapter's Startups tab, so "Startups" (matching
  // the wireframe's own wording) links back to that real, reachable page.
  const startupsBackHref = startup.chapterId
    ? `/admin/chapters/detail/${startup.chapterId}`
    : "/admin/chapters";

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link
          to={startupsBackHref}
          className="hover:text-text-heading transition-colors"
        >
          Startups
        </Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">
          {startup.name || "Startup"}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-brand-black text-white flex items-center justify-center shrink-0">
                <Rocket size={24} strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-poppins font-semibold text-card text-text-heading">
                  {startup.name || "Untitled Startup"}
                </h1>
                {/* TODO(backend): Startup has no status field today. */}
                <Badge variant="neutral" className="mt-1">
                  {startup.status || "—"}
                </Badge>
              </div>
            </div>
            <dl className="space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Founder</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.founder || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Industry</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.industry || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Chapter</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.chapter || "N/A"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Joined Date</dt>
                <dd className="font-inter font-medium text-small text-text-heading">
                  {startup.createdAt
                    ? new Date(startup.createdAt).toLocaleDateString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-8">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-body text-text-heading">
                Journey Progress
              </h3>
              <div className="text-right">
                <p className="font-inter text-caption uppercase tracking-wider text-text-muted">
                  Overall Progress
                </p>
                <p className="font-poppins font-bold text-card text-text-heading">
                  {startup.progressPercentage ?? 0}%
                </p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-canvas-bg rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-brand-black rounded-full"
                style={{ width: `${startup.progressPercentage ?? 0}%` }}
              />
            </div>

            <div className="space-y-3">
              {stages.map((stage) => {
                const meta =
                  STAGE_STATUS_META[stage.status] || STAGE_STATUS_META.locked;
                const StatusIcon = meta.icon;
                const isLocked = stage.status === "locked";
                const canViewDetails = !isLocked && stage.submissionId;

                return (
                  <div
                    key={stage.stageNumber}
                    className={`flex items-center justify-between gap-4 p-4 rounded-lg border ${
                      isLocked
                        ? "border-border-subtle bg-canvas-bg/50"
                        : "border-border-subtle bg-surface-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          isLocked
                            ? "bg-canvas-bg border border-border-subtle text-text-muted"
                            : "bg-brand-black text-white"
                        }`}
                      >
                        <StatusIcon size={16} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`font-poppins font-semibold text-small ${
                            isLocked ? "text-text-muted" : "text-text-heading"
                          }`}
                        >
                          {stage.label}
                        </p>
                        <p className="font-inter text-caption text-text-muted">
                          {meta.label}
                        </p>
                      </div>
                    </div>
                    {canViewDetails ? (
                      <Link
                        to={`/admin/startups/submission?id=${stage.submissionId}&stage=${encodeURIComponent(stage.label)}&startupId=${startupId}`}
                        className="shrink-0 flex items-center gap-1.5 font-inter font-semibold text-caption text-text-heading hover:opacity-70 transition-opacity"
                      >
                        View Details <ArrowRight size={14} strokeWidth={2} />
                      </Link>
                    ) : (
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          to={startupsBackHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 border border-brand-black rounded-md font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2} /> Back to Startups
        </Link>
      </div>
    </AdminShell>
  );
}
