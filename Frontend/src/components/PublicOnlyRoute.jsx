import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
    </div>
  );
}

const PublicOnlyRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (isAuthenticated && user) {
    // If pending verification, they should complete onboarding
    if (!user.email_verified) {
      return <Navigate to="/onboarding/verify-email" replace />;
    }

    // Otherwise redirect to their respective dashboard
    if (user.role === "admin" || user.role === "super_admin") return <Navigate to="/admin" replace />;
    if (user.role === "company") return <Navigate to="/company/dashboard" replace />;
    if (user.role === "investor") return <Navigate to="/investor" replace />;
    if (user.role === "mentor") return <Navigate to="/mentor" replace />;
    if (user.role === "incubator") return <Navigate to="/incubator" replace />;
    return <Navigate to="/dashboard" replace />; // student
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
