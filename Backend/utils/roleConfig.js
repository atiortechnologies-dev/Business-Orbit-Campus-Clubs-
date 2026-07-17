const StudentProfile = require("../model/StudentProfile");
const MentorProfile = require("../model/MentorProfile");
const InvestorProfile = require("../model/InvestorProfile");
const IncubatorProfile = require("../model/IncubatorProfile");
const CompanyProfile = require("../model/CompanyProfile");

const roleConfig = {
  student: {
    ProfileModel: StudentProfile,
    profileFields: ["college", "degree", "graduation_year"],
    redirectTo: "welcome_to_your_chapter",
    initialStatus: "pending_verification",
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
  },
  incubator: {
    ProfileModel: IncubatorProfile,
    profileFields: ["incubator_name", "organization", "city", "website"],
    redirectTo: "email_verification",
    initialStatus: "pending_verification",
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
  },
};

module.exports = roleConfig;
