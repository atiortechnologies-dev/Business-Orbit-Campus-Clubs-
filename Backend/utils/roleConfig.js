const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

const roleConfig = {
  student: {
    ProfileModel: StudentProfile,
    profileFields: ["college", "degree", "graduation_year"],
    redirectTo: "welcome_to_your_chapter",
    initialStatus: "pending_verification",
    dashboardRedirect: "student_dashboard",
  },
  mentor: {
    ProfileModel: MentorProfile,
    profileFields: [
      "organization",
      "designation",
      "expertise",
      "years_of_experience",
    ],
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
    dashboardRedirect: "mentor_dashboard",
  },
  investor: {
    ProfileModel: InvestorProfile,
    profileFields: [
      "organization",
      "investment_focus",
      "investment_stage",
      "profile_url",
    ],
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
    dashboardRedirect: "investor_dashboard",
  },
  incubator: {
    ProfileModel: IncubatorProfile,
    profileFields: ["incubator_name", "organization", "city", "website"],
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
    dashboardRedirect: "incubator_dashboard",
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
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
    dashboardRedirect: "company_dashboard",
  },
};

module.exports = roleConfig;
