const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

const roleConfig = {
  student: {
    ProfileModel: StudentProfile,
    profileFields: ["college", "degree", "graduation_year"],
    redirectTo: "/onboarding/welcome",
    initialStatus: "pending_verification",
    dashboardRedirect: "/dashboard",
    loginRedirect: "/dashboard",
  },
  mentor: {
    ProfileModel: MentorProfile,
    profileFields: [
      "organization",
      "designation",
      "expertise",
      "years_of_experience",
    ],
    redirectTo: "/onboarding/verify-email",
    initialStatus: "pending_verification",
    dashboardRedirect: "/mentor",
  },
  investor: {
    ProfileModel: InvestorProfile,
    profileFields: [
      "organization",
      "investment_focus",
      "investment_stage",
      "profile_url",
    ],
    redirectTo: "/onboarding/verify-email",
    initialStatus: "pending_verification",
    dashboardRedirect: "/investor",
  },
  incubator: {
    ProfileModel: IncubatorProfile,
    profileFields: ["incubator_name", "organization", "city", "website"],
    redirectTo: "/onboarding/verify-email",
    initialStatus: "pending_verification",
    dashboardRedirect: "/incubator",
  },
  company: {
    ProfileModel: CompanyProfile,
    profileFields: [
      "company_name",
      "industry",
      "company_size",
      "website",
      "contact_person",
    ],
    redirectTo: "/onboarding/verify-email",
    initialStatus: "pending_verification",
    dashboardRedirect: "/company/dashboard",
  },
};

module.exports = roleConfig;
