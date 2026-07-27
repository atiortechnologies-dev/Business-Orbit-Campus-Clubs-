import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortalLayout from "@/components/layout/PortalLayout";

// ======================
// Authentication Pages
// ======================
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

// ======================
// Incubation
// ======================
import DiscoverIncubators from "@/pages/incubation/DiscoverIncubators";
import IncubatorDetails from "@/pages/incubation/IncubatorDetails";
import ApplyIncubator from "@/pages/incubation/ApplyIncubator";
import MyIncubation from "@/pages/incubation/MyIncubation";
import Acceptance from "@/pages/incubation/Acceptance";

// ======================
// Freelancing
// ======================
import FreelancingOpportunities from "@/pages/freelancing/FreelancingOpportunities";
import OpportunityDetails from "@/pages/freelancing/OpportunityDetails";
import ApplyOpportunity from "@/pages/freelancing/ApplyOpportunity";
import MyApplications from "@/pages/freelancing/MyApplications";
import InterviewSchedule from "@/pages/freelancing/InterviewSchedule";

// ======================
// Company
// ======================
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import MyOpportunities from "@/pages/company/MyOpportunities";
import PostOpportunityStep1 from "@/pages/company/PostOpportunityStep1";
import PostOpportunityStep2 from "@/pages/company/PostOpportunityStep2";
import PostOpportunityStep3 from "@/pages/company/PostOpportunityStep3";
import PostOpportunityStep4 from "@/pages/company/PostOpportunityStep4";
import { DraftProvider } from "@/lib/draftContext";

const AuthenticatedApp = () => {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
    authError,
    navigateToLogin,
  } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === "user_not_registered") {
      return <UserNotRegisteredError />;
    }

    if (authError.type === "auth_required") {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute
            unauthenticatedElement={<Navigate to="/login" replace />}
          />
        }
      >
        <Route element={<PortalLayout />}>

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/company/dashboard" replace />}
          />

          {/* ================= COMPANY ================= */}

          <Route
            path="/company/dashboard"
            element={<CompanyDashboard />}
          />

          <Route
            path="/company/my-opportunities"
            element={<MyOpportunities />}
          />

<Route
  path="/company/post-opportunity"
  element={<PostOpportunityStep1 />}
/>

          <Route
            path="/company/post-opportunity/requirements"
            element={<PostOpportunityStep2 />}
          />

          <Route
            path="/company/post-opportunity/description"
            element={<PostOpportunityStep3 />}
          />

          <Route
            path="/company/post-opportunity/preview"
            element={<PostOpportunityStep4 />}
          />

          {/* ================= INCUBATION ================= */}

          <Route
            path="/incubators"
            element={<DiscoverIncubators />}
          />

          <Route
            path="/incubators/:id"
            element={<IncubatorDetails />}
          />

          <Route
            path="/incubators/:id/apply"
            element={<ApplyIncubator />}
          />

          <Route
            path="/my-incubation"
            element={<MyIncubation />}
          />

          <Route
            path="/my-incubation/accepted"
            element={<Acceptance />}
          />

          {/* ================= FREELANCING ================= */}

          <Route
            path="/freelancing"
            element={<FreelancingOpportunities />}
          />

          <Route
            path="/freelancing/opportunity/:id"
            element={<OpportunityDetails />}
          />

          <Route
            path="/freelancing/opportunity/:id/apply"
            element={<ApplyOpportunity />}
          />

          <Route
            path="/freelancing/my-applications"
            element={<MyApplications />}
          />

          <Route
            path="/freelancing/interview/:applicationId"
            element={<InterviewSchedule />}
          />

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
<AuthProvider>
  <DraftProvider>
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <AuthenticatedApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  </DraftProvider>
</AuthProvider>
  );
}

export default App;