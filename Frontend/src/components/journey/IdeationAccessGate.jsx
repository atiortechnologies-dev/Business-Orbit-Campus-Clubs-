import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Users } from "lucide-react";
import { getStartupStages } from "@/api/startup/startupApi";
import DashboardShell from "@/components/dashboard/DashboardShell";
import FeatureLockedNotice from "@/components/ui/FeatureLockedNotice";

function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
    </div>
  );
}

// Gates the Mentor Network and Investor Network sections until the
// student's Ideation stage is approved — unlike StageGuard (which
// redirects locked stages back to the journey hub), this renders an
// explanatory notice in place, inside the normal shell, so a student who
// clicks "Mentors" from the sidebar sees *why* it's locked rather than
// bouncing away. Checks specifically for "approved"/"completed" — the
// same two-value check BuildStartupJourney.jsx:235 uses to mean "this
// stage has been cleared" (stricter than StageGuard's three-value check,
// which also allows "active" — not the right condition for "has this
// been reviewed and approved").
export default function IdeationAccessGate() {
  const [status, setStatus] = useState("loading"); // 'loading' | 'unlocked' | 'locked'

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getStartupStages();
        const stages = res?.data || res || [];
        const ideation = stages.find(
          (s) => (s.stageName || "").toLowerCase() === "ideation",
        );
        const cleared =
          ideation && ["approved", "completed"].includes(ideation.status);
        if (!cancelled) setStatus(cleared ? "unlocked" : "locked");
      } catch (err) {
        console.error("Failed to load startup stages:", err);
        // Fail closed — same reasoning as StageGuard.
        if (!cancelled) setStatus("locked");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return <PageLoader />;

  if (status === "locked") {
    return (
      <DashboardShell pageId="ideation-gate">
        <FeatureLockedNotice
          icon={Users}
          heading="Unlocks after Ideation is approved"
          message="You'll get access to Mentors and Investors once your Ideation stage is reviewed and approved. Keep working on your submission in the meantime."
        />
      </DashboardShell>
    );
  }

  return <Outlet />;
}
