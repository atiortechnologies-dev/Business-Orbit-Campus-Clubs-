import { Briefcase } from "lucide-react";
import RoleSignupForm from "@/components/auth/RoleSignupForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const INVESTMENT_STAGES = [
  "Pre-Seed",
  "Seed",
  "Early Stage / Series A",
  "Growth Stage / Series B+",
  "All Stages",
];

const FIELDS = [
  { name: "full_name", label: "Full Name", placeholder: "e.g. Morgan Wells" },
  { name: "email", label: "Email", type: "email", placeholder: "you@fund.com" },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "organization",
    label: "Organization / Fund Name",
    placeholder: "e.g. Wells Ventures",
  },
  {
    name: "investment_focus",
    label: "Investment Focus / Sectors",
    placeholder: "e.g. SaaS, FinTech, AI, EdTech",
  },
  {
    name: "investment_stage",
    label: "Investment Stage",
    type: "select",
    options: INVESTMENT_STAGES,
  },
  {
    name: "profile_url",
    label: "LinkedIn / AngelList / Fund Website (Optional)",
    type: "url",
    placeholder: "https://linkedin.com/in/...",
    colSpan: 2,
  },
];

export default function InvestorSignupPage() {
  useDocumentTitle("Investor Sign Up — BOCC");

  return (
    <RoleSignupForm
      roleId="investor"
      title="Create Your Investor Account"
      subtitle="Discover high-potential student startups early."
      icon={
        <Briefcase size={22} strokeWidth={2} className="text-accent-neon" />
      }
      fields={FIELDS}
    />
  );
}
