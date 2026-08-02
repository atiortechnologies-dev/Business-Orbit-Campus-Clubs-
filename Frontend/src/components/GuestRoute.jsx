import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-black" />
    </div>
  );
}

const getDashboardPath = (role) => {
  switch (role) {
    case "admin":
    case "super_admin":
      return "/admin";
    case "student":
      return "/dashboard";
    case "company":
      return "/company/dashboard";
    case "investor":
      return "/investor";
    case "mentor":
      return "/mentor";
    case "incubator":
      return "/incubator";
    default:
      return "/dashboard";
  }
};

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  // If user is already authenticated, redirect them away from auth pages
  if (user) {
    const destination = getDashboardPath(user.role);
    return <Navigate to={destination} replace />;
  }

  // Otherwise, allow them to view the guest/auth page
  return <Outlet />;
};

export default GuestRoute;
