import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';

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
const DiscoverIncubators = lazy(() => import('@/pages/incubators/DiscoverIncubators'));
const IncubatorProfile = lazy(() => import('@/pages/incubators/IncubatorProfile'));
const IncubatorApplicationForm = lazy(() => import('@/pages/incubators/IncubatorApplicationForm'));
const IncubationConfirmed = lazy(() => import('@/pages/incubators/IncubationConfirmed'));
const MyIncubation = lazy(() => import('@/pages/incubators/MyIncubation'));
const FreelancingOpportunities = lazy(() => import('@/pages/freelancing/FreelancingOpportunities'));
const OpportunityDetail = lazy(() => import('@/pages/freelancing/OpportunityDetail'));
const FreelancingApplicationForm = lazy(() => import('@/pages/freelancing/FreelancingApplicationForm'));
const ApplyConfirmation = lazy(() => import('@/pages/freelancing/ApplyConfirmation'));
const MyApplications = lazy(() => import('@/pages/freelancing/MyApplications'));
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
const AnnouncementsDashboard = lazy(() => import('@/pages/admin/AnnouncementsDashboard'));
const CreateAnnouncement = lazy(() => import('@/pages/admin/CreateAnnouncement'));
const PreviewAnnouncement = lazy(() => import('@/pages/admin/PreviewAnnouncement'));
const AnnouncementPublished = lazy(() => import('@/pages/admin/AnnouncementPublished'));
const ChapterManagement = lazy(() => import('@/pages/admin/ChapterManagement'));
const ChapterDetail = lazy(() => import('@/pages/admin/ChapterDetail'));
const OpportunityApprovalQueue = lazy(() => import('@/pages/admin/OpportunityApprovalQueue'));
const OpportunityReview = lazy(() => import('@/pages/admin/OpportunityReview'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
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
const PostOpportunityStep1 = lazy(() => import('@/pages/company/PostOpportunityStep1'));
const PostOpportunityStep2 = lazy(() => import('@/pages/company/PostOpportunityStep2'));
const PostOpportunityStep3 = lazy(() => import('@/pages/company/PostOpportunityStep3'));
const PostOpportunityStep4 = lazy(() => import('@/pages/company/PostOpportunityStep4'));
const ApplicantsList = lazy(() => import('@/pages/company/ApplicantsList'));
const ApplicantDetail = lazy(() => import('@/pages/company/ApplicantDetail'));

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
  { path: '/company/dashboard', element: withSuspense(CompanyDashboard) },
  { path: '/company/my-opportunities', element: withSuspense(CompanyMyOpportunities) },
  { path: '/company/post-opportunity/step-1', element: withSuspense(PostOpportunityStep1) },
  { path: '/company/post-opportunity/step-2', element: withSuspense(PostOpportunityStep2) },
  { path: '/company/post-opportunity/step-3', element: withSuspense(PostOpportunityStep3) },
  { path: '/company/post-opportunity/step-4', element: withSuspense(PostOpportunityStep4) },
  { path: '/company/applicants', element: withSuspense(ApplicantsList) },
  { path: '/company/applicants/detail', element: withSuspense(ApplicantDetail) },
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
  { path: '/incubators', element: withSuspense(DiscoverIncubators) },
  { path: '/incubators/profile', element: withSuspense(IncubatorProfile) },
  { path: '/incubators/apply', element: withSuspense(IncubatorApplicationForm) },
  { path: '/incubators/confirmed', element: withSuspense(IncubationConfirmed) },
  { path: '/incubators/tracker', element: withSuspense(MyIncubation) },
  { path: '/freelancing', element: withSuspense(FreelancingOpportunities) },
  { path: '/freelancing/opportunity', element: withSuspense(OpportunityDetail) },
  { path: '/freelancing/apply', element: withSuspense(FreelancingApplicationForm) },
  { path: '/freelancing/applied', element: withSuspense(ApplyConfirmation) },
  { path: '/freelancing/applications', element: withSuspense(MyApplications) },
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
  { path: '/admin/announcements', element: withSuspense(AnnouncementsDashboard) },
  { path: '/admin/announcements/create', element: withSuspense(CreateAnnouncement) },
  { path: '/admin/announcements/preview', element: withSuspense(PreviewAnnouncement) },
  { path: '/admin/announcements/published', element: withSuspense(AnnouncementPublished) },
  { path: '/admin/chapters', element: withSuspense(ChapterManagement) },
  { path: '/admin/chapters/detail', element: withSuspense(ChapterDetail) },
  { path: '/admin/opportunities', element: withSuspense(OpportunityApprovalQueue) },
  { path: '/admin/opportunities/review', element: withSuspense(OpportunityReview) },
  { path: '/admin/settings', element: withSuspense(AdminSettings) },
  { path: '/investor', element: withSuspense(InvestorPortal) },
  { path: '/investor/pitch-decks', element: withSuspense(IncomingPitchDecks) },
  { path: '/investor/pitch-decks/review', element: withSuspense(PitchDeck) },
  { path: '/mentor', element: withSuspense(MentorPortal) },
  { path: '/mentor/requests', element: withSuspense(MentorRequests) },
  { path: '/mentor/chats', element: withSuspense(MentorChats) },
  { path: '/mentor/meetings', element: withSuspense(MentorMeetings) },
  { path: '/mentor/profile', element: withSuspense(MentorProfile) },
]);
