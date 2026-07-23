import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import RoleSelection from '@/pages/auth/RoleSelection';
import Dashboard from '@/pages/Dashboard';
import BuildStartupJourney from '@/pages/BuildStartupJourney';
import Notifications from '@/pages/Notifications';
import Incubator from '@/pages/incubator/Incubator';
import Applications from '@/pages/incubator/Applications';
import ApplicationReview from '@/pages/incubator/ApplicationReview';
import Messages from '@/pages/incubator/Messages';
import Settings from '@/pages/incubator/Settings';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import IdeationOverview from '@/pages/journey/ideation/IdeationOverview';
import IdeaSubmission from '@/pages/journey/ideation/IdeaSubmission';
import IdeationSubmissionConfirmation from '@/pages/journey/ideation/SubmissionConfirmation';
import IdeationReviewMeeting from '@/pages/journey/ideation/ReviewMeeting';
import IdeationReviewResult from '@/pages/journey/ideation/ReviewResult';
import IdeationResources from '@/pages/journey/ideation/TemplatesResources';
import ValidationOverview from '@/pages/journey/validation/ValidationOverview';
import SurveyTracker from '@/pages/journey/validation/SurveyTracker';
import EvidenceUpload from '@/pages/journey/validation/EvidenceUpload';
import ValidationReportSubmission from '@/pages/journey/validation/ReportSubmission';
import ValidationSubmissionConfirmation from '@/pages/journey/validation/SubmissionConfirmation';
import ValidationReviewMeeting from '@/pages/journey/validation/ReviewMeeting';
import ValidationReviewResult from '@/pages/journey/validation/ReviewResult';
import AdminDashboard from '@/pages/admin/Admin';
import VerificationQueue from '@/pages/admin/VerificationQueue';
import VerificationDetail from '@/pages/admin/VerificationDetail';
import VerificationDecision from '@/pages/admin/VerificationDecision';
import ReviewQueue from '@/pages/admin/ReviewQueue';
import ReviewDetail from '@/pages/admin/ReviewDetail';
import ReviewWorkspace from '@/pages/admin/ReviewWorkspace';
import ReviewOutcome from '@/pages/admin/ReviewOutcome';
import ScheduleMeeting from '@/pages/admin/ScheduleMeeting';
import AuditLog from '@/pages/admin/AuditLog';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/role-selection', element: <RoleSelection /> },
    ],
  },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/build-startup/journey', element: <BuildStartupJourney /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/incubator', element: <Incubator /> },
  { path: '/incubator/applications', element: <Applications /> },
  { path: '/incubator/applications/review', element: <ApplicationReview /> },
  { path: '/incubator/messages', element: <Messages /> },
  { path: '/incubator/settings', element: <Settings /> },
  { path: '/legal/privacy-policy', element: <PrivacyPolicy /> },
  { path: '/build-startup/journey/ideation', element: <IdeationOverview /> },
  { path: '/build-startup/journey/ideation/submit', element: <IdeaSubmission /> },
  { path: '/build-startup/journey/ideation/confirmation', element: <IdeationSubmissionConfirmation /> },
  { path: '/build-startup/journey/ideation/review-meeting', element: <IdeationReviewMeeting /> },
  { path: '/build-startup/journey/ideation/review-result', element: <IdeationReviewResult /> },
  { path: '/build-startup/journey/ideation/resources', element: <IdeationResources /> },
  { path: '/build-startup/journey/validation', element: <ValidationOverview /> },
  { path: '/build-startup/journey/validation/survey-tracker', element: <SurveyTracker /> },
  { path: '/build-startup/journey/validation/evidence-upload', element: <EvidenceUpload /> },
  { path: '/build-startup/journey/validation/report-submission', element: <ValidationReportSubmission /> },
  { path: '/build-startup/journey/validation/confirmation', element: <ValidationSubmissionConfirmation /> },
  { path: '/build-startup/journey/validation/review-meeting', element: <ValidationReviewMeeting /> },
  { path: '/build-startup/journey/validation/review-result', element: <ValidationReviewResult /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/verification', element: <VerificationQueue /> },
  { path: '/admin/verification/detail', element: <VerificationDetail /> },
  { path: '/admin/verification/decision', element: <VerificationDecision /> },
  { path: '/admin/reviews', element: <ReviewQueue /> },
  { path: '/admin/reviews/detail', element: <ReviewDetail /> },
  { path: '/admin/reviews/workspace', element: <ReviewWorkspace /> },
  { path: '/admin/reviews/outcome', element: <ReviewOutcome /> },
  { path: '/admin/reviews/schedule-meeting', element: <ScheduleMeeting /> },
  { path: '/admin/audit-log', element: <AuditLog /> },
]);
