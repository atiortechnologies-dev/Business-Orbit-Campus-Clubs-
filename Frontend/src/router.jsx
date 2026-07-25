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
import OnboardingWelcome from '@/pages/onboarding/Welcome';
import VerifyEmail from '@/pages/onboarding/VerifyEmail';
import VerificationProgress from '@/pages/onboarding/VerificationProgress';
import ApplicationRejected from '@/pages/onboarding/ApplicationRejected';
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
import IncubationProofSubmission from '@/pages/journey/mvp/IncubationProofSubmission';
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
import LandingHome from '@/pages/landing/Home';
import LandingStudent from '@/pages/landing/Student';
import LandingMentor from '@/pages/landing/Mentor';
import LandingInvestor from '@/pages/landing/Investor';
import LandingCompanies from '@/pages/landing/Companies';
import LandingIncubator from '@/pages/landing/Incubator';
import InvestorPortal from '@/pages/investor/Investor';
import IncomingPitchDecks from '@/pages/investor/IncomingPitchDecks';
import PitchDeck from '@/pages/investor/PitchDeck';
import MentorPortal from '@/pages/mentor/Mentor';
import MentorRequests from '@/pages/mentor/Requests';
import MentorChats from '@/pages/mentor/Chats';
import MentorMeetings from '@/pages/mentor/Meetings';
import MentorProfile from '@/pages/mentor/Profile';

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
      { path: '/onboarding/welcome', element: <OnboardingWelcome /> },
      { path: '/onboarding/verify-email', element: <VerifyEmail /> },
      { path: '/onboarding/verification-progress', element: <VerificationProgress /> },
      { path: '/onboarding/application-rejected', element: <ApplicationRejected /> },
    ],
  },
  { path: '/landing', element: <LandingHome /> },
  { path: '/landing/student', element: <LandingStudent /> },
  { path: '/landing/mentor', element: <LandingMentor /> },
  { path: '/landing/investor', element: <LandingInvestor /> },
  { path: '/landing/incubator', element: <LandingIncubator /> },
  { path: '/landing/companies', element: <LandingCompanies /> },
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
  { path: '/build-startup/journey/mvp/incubation-proof', element: <IncubationProofSubmission /> },
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
  { path: '/investor', element: <InvestorPortal /> },
  { path: '/investor/pitch-decks', element: <IncomingPitchDecks /> },
  { path: '/investor/pitch-decks/review', element: <PitchDeck /> },
  { path: '/mentor', element: <MentorPortal /> },
  { path: '/mentor/requests', element: <MentorRequests /> },
  { path: '/mentor/chats', element: <MentorChats /> },
  { path: '/mentor/meetings', element: <MentorMeetings /> },
  { path: '/mentor/profile', element: <MentorProfile /> },
]);
