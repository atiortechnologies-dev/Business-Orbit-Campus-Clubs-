import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/auth/Login';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import RoleSelection from '@/pages/auth/RoleSelection';
import StudentSignup from '@/pages/auth/StudentSignup';
import CompanySignup from '@/pages/auth/CompanySignup';
import InvestorSignup from '@/pages/auth/InvestorSignup';
import MentorSignup from '@/pages/auth/MentorSignup';
import IncubatorSignup from '@/pages/auth/IncubatorSignup';
import Dashboard from '@/pages/Dashboard';
import BuildStartupJourney from '@/pages/BuildStartupJourney';
import Notifications from '@/pages/Notifications';
import StudentSettings from '@/pages/Settings';
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
import MvpOverview from '@/pages/journey/mvp/MvpOverview';
import ChooseProductType from '@/pages/journey/mvp/ChooseProductType';
import MvpSubmission from '@/pages/journey/mvp/MvpSubmission';
import MvpSubmissionSuccess from '@/pages/journey/mvp/SubmissionSuccess';
import MvpIncubationProofSubmission from '@/pages/journey/mvp/MvpIncubationProofSubmission';
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
import TractionStage from '@/pages/journey/traction/TractionStage';
import UserAcquisitionTracker from '@/pages/journey/traction/UserAcquisitionTracker';
import CustomerFeedbackUpload from '@/pages/journey/traction/CustomerFeedbackUpload';
import TractionProductSubmission from '@/pages/journey/traction/TractionProductSubmission';
import TractionReview from '@/pages/journey/traction/TractionReview';
import TractionReviewMeeting from '@/pages/journey/traction/TractionReviewMeeting';
import TractionApproved from '@/pages/journey/traction/TractionApproved';
import IncubationVerificationReview from '@/pages/journey/mvp/IncubationVerificationReview';
import IncubationVerificationApproved from '@/pages/journey/mvp/IncubationVerificationApproved';
import LaunchStage from '@/pages/journey/launch/LaunchStage';
import LaunchSubmission from '@/pages/journey/launch/LaunchSubmission';
import FinalPitchDeckUpload from '@/pages/journey/launch/FinalPitchDeckUpload';
import LaunchProofUpload from '@/pages/journey/launch/LaunchProofUpload';
import LaunchVerificationReview from '@/pages/journey/launch/LaunchVerificationReview';
import JourneyComplete from '@/pages/journey/JourneyComplete';
import CertificateAlumni from '@/pages/journey/CertificateAlumni';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/role-selection', element: <RoleSelection /> },
      { path: '/signup/student', element: <StudentSignup /> },
      { path: '/signup/company', element: <CompanySignup /> },
      { path: '/signup/investor', element: <InvestorSignup /> },
      { path: '/signup/mentor', element: <MentorSignup /> },
      { path: '/signup/incubator', element: <IncubatorSignup /> },
    ],
  },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/build-startup/journey', element: <BuildStartupJourney /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/settings', element: <StudentSettings /> },
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
  { path: '/build-startup/journey/mvp', element: <MvpOverview /> },
  { path: '/build-startup/journey/mvp/choose-product-type', element: <ChooseProductType /> },
  { path: '/build-startup/journey/mvp/submit', element: <MvpSubmission /> },
  { path: '/build-startup/journey/mvp/success', element: <MvpSubmissionSuccess /> },
  { path: '/build-startup/journey/mvp/incubation-proof', element: <MvpIncubationProofSubmission /> },
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
  { path: "/build-startup/journey/traction", element: <TractionStage /> },
  { path: "/build-startup/journey/traction/acquisition-tracker", element: <UserAcquisitionTracker /> },
  { path: "/build-startup/journey/traction/feedback-upload", element: <CustomerFeedbackUpload /> },
  { path: "/build-startup/journey/traction/product-submission", element: <TractionProductSubmission /> },
  { path: "/build-startup/journey/traction/review", element: <TractionReview /> },
  { path: "/build-startup/journey/traction/review-meeting", element: <TractionReviewMeeting /> },
  { path: "/build-startup/journey/traction/approved", element: <TractionApproved /> },
  { path: "/build-startup/journey/mvp/incubation-verification", element: <IncubationVerificationReview /> },
  { path: "/build-startup/journey/mvp/incubation-verification/approved", element: <IncubationVerificationApproved /> },
  { path: "/build-startup/journey/launch", element: <LaunchStage /> },
  { path: "/build-startup/journey/launch/submission", element: <LaunchSubmission /> },
  { path: "/build-startup/journey/launch/pitch-deck", element: <FinalPitchDeckUpload /> },
  { path: "/build-startup/journey/launch/proof-upload", element: <LaunchProofUpload /> },
  { path: "/build-startup/journey/launch/verification", element: <LaunchVerificationReview /> },
  { path: "/build-startup/journey/complete", element: <JourneyComplete /> },
  { path: "/build-startup/journey/certificate", element: <CertificateAlumni /> },
]);