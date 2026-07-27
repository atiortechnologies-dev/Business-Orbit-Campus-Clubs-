import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
<<<<<<< HEAD
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
=======

const Login = lazy(() => import('@/pages/auth/Login'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const RoleSelection = lazy(() => import('@/pages/auth/RoleSelection'));
const StudentSignup = lazy(() => import('@/pages/auth/StudentSignup'));
const CompanySignup = lazy(() => import('@/pages/auth/CompanySignup'));
const InvestorSignup = lazy(() => import('@/pages/auth/InvestorSignup'));
const MentorSignup = lazy(() => import('@/pages/auth/MentorSignup'));
const IncubatorSignup = lazy(() => import('@/pages/auth/IncubatorSignup'));
const OnboardingWelcome = lazy(() => import('@/pages/onboarding/Welcome'));
const VerifyEmail = lazy(() => import('@/pages/onboarding/VerifyEmail'));
const VerificationProgress = lazy(() => import('@/pages/onboarding/VerificationProgress'));
const ApplicationRejected = lazy(() => import('@/pages/onboarding/ApplicationRejected'));
const CompleteProfileStudent = lazy(() => import('@/pages/onboarding/complete-profile/Student'));
const CompleteProfileMentor = lazy(() => import('@/pages/onboarding/complete-profile/Mentor'));
const CompleteProfileInvestor = lazy(() => import('@/pages/onboarding/complete-profile/Investor'));
const CompleteProfileIncubator = lazy(() => import('@/pages/onboarding/complete-profile/Incubator'));
const CompleteProfileCompany = lazy(() => import('@/pages/onboarding/complete-profile/Company'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const BuildStartupJourney = lazy(() => import('@/pages/BuildStartupJourney'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const StudentSettings = lazy(() => import('@/pages/Settings'));
const Incubator = lazy(() => import('@/pages/incubator/Incubator'));
const Applications = lazy(() => import('@/pages/incubator/Applications'));
const ApplicationReview = lazy(() => import('@/pages/incubator/ApplicationReview'));
const Messages = lazy(() => import('@/pages/incubator/Messages'));
const Settings = lazy(() => import('@/pages/incubator/Settings'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));
const IdeationOverview = lazy(() => import('@/pages/journey/ideation/IdeationOverview'));
const IdeaSubmission = lazy(() => import('@/pages/journey/ideation/IdeaSubmission'));
const IdeationSubmissionConfirmation = lazy(() => import('@/pages/journey/ideation/SubmissionConfirmation'));
const IdeationReviewMeeting = lazy(() => import('@/pages/journey/ideation/ReviewMeeting'));
const IdeationReviewResult = lazy(() => import('@/pages/journey/ideation/ReviewResult'));
const IdeationResources = lazy(() => import('@/pages/journey/ideation/TemplatesResources'));
const ValidationOverview = lazy(() => import('@/pages/journey/validation/ValidationOverview'));
const SurveyTracker = lazy(() => import('@/pages/journey/validation/SurveyTracker'));
const EvidenceUpload = lazy(() => import('@/pages/journey/validation/EvidenceUpload'));
const ValidationReportSubmission = lazy(() => import('@/pages/journey/validation/ReportSubmission'));
const ValidationSubmissionConfirmation = lazy(() => import('@/pages/journey/validation/SubmissionConfirmation'));
const ValidationReviewMeeting = lazy(() => import('@/pages/journey/validation/ReviewMeeting'));
const ValidationReviewResult = lazy(() => import('@/pages/journey/validation/ReviewResult'));
const MvpOverview = lazy(() => import('@/pages/journey/mvp/MvpOverview'));
const ChooseProductType = lazy(() => import('@/pages/journey/mvp/ChooseProductType'));
const MvpSubmission = lazy(() => import('@/pages/journey/mvp/MvpSubmission'));
const MvpSubmissionSuccess = lazy(() => import('@/pages/journey/mvp/SubmissionSuccess'));
const IncubationProofSubmission = lazy(() => import('@/pages/journey/mvp/IncubationProofSubmission'));
const IncubationVerificationReview = lazy(() => import('@/pages/journey/mvp/IncubationVerificationReview'));
const IncubationVerificationApproved = lazy(() => import('@/pages/journey/mvp/IncubationVerificationApproved'));
const TractionStage = lazy(() => import('@/pages/journey/traction/TractionStage'));
const UserAcquisitionTracker = lazy(() => import('@/pages/journey/traction/UserAcquisitionTracker'));
const CustomerFeedbackUpload = lazy(() => import('@/pages/journey/traction/CustomerFeedbackUpload'));
const TractionProductSubmission = lazy(() => import('@/pages/journey/traction/TractionProductSubmission'));
const TractionReview = lazy(() => import('@/pages/journey/traction/TractionReview'));
const TractionReviewMeeting = lazy(() => import('@/pages/journey/traction/TractionReviewMeeting'));
const TractionApproved = lazy(() => import('@/pages/journey/traction/TractionApproved'));
const LaunchStage = lazy(() => import('@/pages/journey/launch/LaunchStage'));
const LaunchSubmission = lazy(() => import('@/pages/journey/launch/LaunchSubmission'));
const FinalPitchDeckUpload = lazy(() => import('@/pages/journey/launch/FinalPitchDeckUpload'));
const LaunchProofUpload = lazy(() => import('@/pages/journey/launch/LaunchProofUpload'));
const LaunchVerificationReview = lazy(() => import('@/pages/journey/launch/LaunchVerificationReview'));
const JourneyComplete = lazy(() => import('@/pages/journey/JourneyComplete'));
const AdminDashboard = lazy(() => import('@/pages/admin/Admin'));
const VerificationQueue = lazy(() => import('@/pages/admin/VerificationQueue'));
const VerificationDetail = lazy(() => import('@/pages/admin/VerificationDetail'));
const VerificationDecision = lazy(() => import('@/pages/admin/VerificationDecision'));
const ReviewQueue = lazy(() => import('@/pages/admin/ReviewQueue'));
const ReviewDetail = lazy(() => import('@/pages/admin/ReviewDetail'));
const ReviewWorkspace = lazy(() => import('@/pages/admin/ReviewWorkspace'));
const ReviewOutcome = lazy(() => import('@/pages/admin/ReviewOutcome'));
const ScheduleMeeting = lazy(() => import('@/pages/admin/ScheduleMeeting'));
const AuditLog = lazy(() => import('@/pages/admin/AuditLog'));
const LandingHome = lazy(() => import('@/pages/landing/Home'));
const LandingStudent = lazy(() => import('@/pages/landing/Student'));
const LandingMentor = lazy(() => import('@/pages/landing/Mentor'));
const LandingInvestor = lazy(() => import('@/pages/landing/Investor'));
const LandingCompanies = lazy(() => import('@/pages/landing/Companies'));
const LandingIncubator = lazy(() => import('@/pages/landing/Incubator'));
const InvestorPortal = lazy(() => import('@/pages/investor/Investor'));
const IncomingPitchDecks = lazy(() => import('@/pages/investor/IncomingPitchDecks'));
const PitchDeck = lazy(() => import('@/pages/investor/PitchDeck'));
const MentorPortal = lazy(() => import('@/pages/mentor/Mentor'));
const MentorRequests = lazy(() => import('@/pages/mentor/Requests'));
const MentorChats = lazy(() => import('@/pages/mentor/Chats'));
const MentorMeetings = lazy(() => import('@/pages/mentor/Meetings'));
const MentorProfile = lazy(() => import('@/pages/mentor/Profile'));
const CompanyDashboard = lazy(() => import('@/pages/company/Dashboard'));
const CompanyMyOpportunities = lazy(() => import('@/pages/company/MyOpportunities'));

// Every page is loaded on demand (one chunk per route) instead of all
// ~70 screens bundling into a single 900KB+ file — npm run build's own
// chunk-size warning was the signal this was overdue, and it only gets
// worse as more screens land. withSuspense() keeps each route entry a
// one-liner instead of repeating <Suspense> 70 times by hand.
function PageLoader() {
  return (
    <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-border-subtle border-t-brand-black rounded-full animate-spin" />
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}
>>>>>>> 93fb0f688d5118c86d951d8694fc80d8a3ee4781

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: withSuspense(Login) },
      { path: '/forgot-password', element: withSuspense(ForgotPassword) },
      { path: '/reset-password', element: withSuspense(ResetPassword) },
      { path: '/role-selection', element: withSuspense(RoleSelection) },
      { path: '/signup/student', element: withSuspense(StudentSignup) },
      { path: '/signup/company', element: withSuspense(CompanySignup) },
      { path: '/signup/investor', element: withSuspense(InvestorSignup) },
      { path: '/signup/mentor', element: withSuspense(MentorSignup) },
      { path: '/signup/incubator', element: withSuspense(IncubatorSignup) },
      { path: '/onboarding/welcome', element: withSuspense(OnboardingWelcome) },
      { path: '/onboarding/verify-email', element: withSuspense(VerifyEmail) },
      { path: '/onboarding/verification-progress', element: withSuspense(VerificationProgress) },
      { path: '/onboarding/application-rejected', element: withSuspense(ApplicationRejected) },
      { path: '/onboarding/complete-profile/student', element: withSuspense(CompleteProfileStudent) },
      { path: '/onboarding/complete-profile/mentor', element: withSuspense(CompleteProfileMentor) },
      { path: '/onboarding/complete-profile/investor', element: withSuspense(CompleteProfileInvestor) },
      { path: '/onboarding/complete-profile/incubator', element: withSuspense(CompleteProfileIncubator) },
      { path: '/onboarding/complete-profile/company', element: withSuspense(CompleteProfileCompany) },
    ],
  },
<<<<<<< HEAD
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
=======
  { path: '/company/dashboard', element: withSuspense(CompanyDashboard) },
  { path: '/company/my-opportunities', element: withSuspense(CompanyMyOpportunities) },
  { path: '/landing', element: withSuspense(LandingHome) },
  { path: '/landing/student', element: withSuspense(LandingStudent) },
  { path: '/landing/mentor', element: withSuspense(LandingMentor) },
  { path: '/landing/investor', element: withSuspense(LandingInvestor) },
  { path: '/landing/incubator', element: withSuspense(LandingIncubator) },
  { path: '/landing/companies', element: withSuspense(LandingCompanies) },
  { path: '/dashboard', element: withSuspense(Dashboard) },
  { path: '/build-startup/journey', element: withSuspense(BuildStartupJourney) },
  { path: '/notifications', element: withSuspense(Notifications) },
  { path: '/settings', element: withSuspense(StudentSettings) },
  { path: '/incubator', element: withSuspense(Incubator) },
  { path: '/incubator/applications', element: withSuspense(Applications) },
  { path: '/incubator/applications/review', element: withSuspense(ApplicationReview) },
  { path: '/incubator/messages', element: withSuspense(Messages) },
  { path: '/incubator/settings', element: withSuspense(Settings) },
  { path: '/legal/privacy-policy', element: withSuspense(PrivacyPolicy) },
  { path: '/build-startup/journey/ideation', element: withSuspense(IdeationOverview) },
  { path: '/build-startup/journey/ideation/submit', element: withSuspense(IdeaSubmission) },
  { path: '/build-startup/journey/ideation/confirmation', element: withSuspense(IdeationSubmissionConfirmation) },
  { path: '/build-startup/journey/ideation/review-meeting', element: withSuspense(IdeationReviewMeeting) },
  { path: '/build-startup/journey/ideation/review-result', element: withSuspense(IdeationReviewResult) },
  { path: '/build-startup/journey/ideation/resources', element: withSuspense(IdeationResources) },
  { path: '/build-startup/journey/validation', element: withSuspense(ValidationOverview) },
  { path: '/build-startup/journey/validation/survey-tracker', element: withSuspense(SurveyTracker) },
  { path: '/build-startup/journey/validation/evidence-upload', element: withSuspense(EvidenceUpload) },
  { path: '/build-startup/journey/validation/report-submission', element: withSuspense(ValidationReportSubmission) },
  { path: '/build-startup/journey/validation/confirmation', element: withSuspense(ValidationSubmissionConfirmation) },
  { path: '/build-startup/journey/validation/review-meeting', element: withSuspense(ValidationReviewMeeting) },
  { path: '/build-startup/journey/validation/review-result', element: withSuspense(ValidationReviewResult) },
  { path: '/build-startup/journey/mvp', element: withSuspense(MvpOverview) },
  { path: '/build-startup/journey/mvp/choose-product-type', element: withSuspense(ChooseProductType) },
  { path: '/build-startup/journey/mvp/submit', element: withSuspense(MvpSubmission) },
  { path: '/build-startup/journey/mvp/success', element: withSuspense(MvpSubmissionSuccess) },
  { path: '/build-startup/journey/mvp/incubation-proof', element: withSuspense(IncubationProofSubmission) },
  { path: '/build-startup/journey/mvp/incubation-verification', element: withSuspense(IncubationVerificationReview) },
  { path: '/build-startup/journey/mvp/incubation-approved', element: withSuspense(IncubationVerificationApproved) },
  { path: '/build-startup/journey/traction', element: withSuspense(TractionStage) },
  { path: '/build-startup/journey/traction/acquisition-tracker', element: withSuspense(UserAcquisitionTracker) },
  { path: '/build-startup/journey/traction/feedback-upload', element: withSuspense(CustomerFeedbackUpload) },
  { path: '/build-startup/journey/traction/product-submission', element: withSuspense(TractionProductSubmission) },
  { path: '/build-startup/journey/traction/review', element: withSuspense(TractionReview) },
  { path: '/build-startup/journey/traction/review-meeting', element: withSuspense(TractionReviewMeeting) },
  { path: '/build-startup/journey/traction/approved', element: withSuspense(TractionApproved) },
  { path: '/build-startup/journey/launch', element: withSuspense(LaunchStage) },
  { path: '/build-startup/journey/launch/submission', element: withSuspense(LaunchSubmission) },
  { path: '/build-startup/journey/launch/pitch-deck', element: withSuspense(FinalPitchDeckUpload) },
  { path: '/build-startup/journey/launch/proof-upload', element: withSuspense(LaunchProofUpload) },
  { path: '/build-startup/journey/launch/verification', element: withSuspense(LaunchVerificationReview) },
  { path: '/build-startup/journey/complete', element: withSuspense(JourneyComplete) },
  { path: '/admin', element: withSuspense(AdminDashboard) },
  { path: '/admin/verification', element: withSuspense(VerificationQueue) },
  { path: '/admin/verification/detail', element: withSuspense(VerificationDetail) },
  { path: '/admin/verification/decision', element: withSuspense(VerificationDecision) },
  { path: '/admin/reviews', element: withSuspense(ReviewQueue) },
  { path: '/admin/reviews/detail', element: withSuspense(ReviewDetail) },
  { path: '/admin/reviews/workspace', element: withSuspense(ReviewWorkspace) },
  { path: '/admin/reviews/outcome', element: withSuspense(ReviewOutcome) },
  { path: '/admin/reviews/schedule-meeting', element: withSuspense(ScheduleMeeting) },
  { path: '/admin/audit-log', element: withSuspense(AuditLog) },
  { path: '/investor', element: withSuspense(InvestorPortal) },
  { path: '/investor/pitch-decks', element: withSuspense(IncomingPitchDecks) },
  { path: '/investor/pitch-decks/review', element: withSuspense(PitchDeck) },
  { path: '/mentor', element: withSuspense(MentorPortal) },
  { path: '/mentor/requests', element: withSuspense(MentorRequests) },
  { path: '/mentor/chats', element: withSuspense(MentorChats) },
  { path: '/mentor/meetings', element: withSuspense(MentorMeetings) },
  { path: '/mentor/profile', element: withSuspense(MentorProfile) },
]);
>>>>>>> 93fb0f688d5118c86d951d8694fc80d8a3ee4781
