import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Adjust path based on your setup

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Helper to send the user back to their designated role dashboard
  const handleGoToDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    switch (user.role) {
      case "admin":
      case "super_admin":
        navigate("/admin");
        break;
      case "company":
        navigate("/company/dashboard");
        break;
      case "investor":
        navigate("/investor");
        break;
      case "mentor":
        navigate("/mentor");
        break;
      case "incubator":
        navigate("/incubator");
        break;
      case "student":
      default:
        navigate("/dashboard");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-canvas-bg flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-surface border border-border-subtle rounded-2xl p-8 shadow-sm">
        {/* Shield / Access Denied Icon */}
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          403 - Access Denied
        </h1>

        {/* Informative Message */}
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
          You don't have permission to access this page. This area is restricted
          to higher privilege accounts.
        </p>

        {/* User Role Badge */}
        {user && (
          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-3 mb-6 text-xs text-text-secondary">
            Logged in as:{" "}
            <span className="font-semibold text-text-primary">
              {user.email}
            </span>
            <br />
            Current Role:{" "}
            <span className="uppercase tracking-wider font-semibold text-text-secondary">
              {user.role}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-text-primary bg-transparent border border-border-subtle rounded-lg hover:bg-neutral-600 transition-colors"
          >
            Go Back
          </button>

          <button
            onClick={handleGoToDashboard}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
