import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getStartupStages } from "@/api/startup/startupApi";

function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
    </div>
  );
}

// Blocks direct-URL access to a journey stage's pages until that stage is
// actually reachable — same "active"/"approved"/"completed" status check
// BuildStartupJourney.jsx's hub page already uses to decide whether a
// stage circle is clickable (src/pages/BuildStartupJourney.jsx:233-236),
// just enforced at the route level too so typing the URL directly can't
// bypass it. Standalone on purpose: doesn't import from or modify
// ProtectedRoute.jsx (that guards auth/role, this guards stage progress —
// different concerns, kept separate).
export default function StageGuard({ requiredStage }) {
  const [status, setStatus] = useState("loading"); // 'loading' | 'unlocked' | 'locked'

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getStartupStages();
        const stages = res?.data || res || [];
        const target = stages.find(
          (s) => (s.stageName || "").toLowerCase() === requiredStage,
        );
        const unlocked =
          target &&
          ["active", "approved", "completed"].includes(target.status);
        if (!cancelled) setStatus(unlocked ? "unlocked" : "locked");
      } catch (err) {
        console.error("Failed to load startup stages:", err);
        // Fail closed — if progress can't be confirmed, don't show a
        // stage that might not actually be unlocked yet.
        if (!cancelled) setStatus("locked");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requiredStage]);

  if (status === "loading") return <PageLoader />;
  if (status === "locked") {
    return <Navigate to="/build-startup/journey" replace />;
  }
  return <Outlet />;
}
