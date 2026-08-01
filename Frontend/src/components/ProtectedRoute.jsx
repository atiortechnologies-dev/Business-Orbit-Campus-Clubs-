import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
    </div>
  );
}

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Prevent infinite loading - if loading > 5 seconds, show error
  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading && !loadingTimeout) {
    return <PageLoader />;
  }

  if (loadingTimeout && !user) {
    return (
      <div className="min-h-screen bg-canvas-bg flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">
            Failed to load your profile. Please login again.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="px-6 py-2 bg-brand-black text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if authenticated
  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if route requires specific roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
