import { Rocket } from "lucide-react";
import RoleSignupForm from "@/components/auth/RoleSignupForm";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const FIELDS = [
  { name: "full_name", label: "Full Name", placeholder: "e.g. Sarah Jenkins" },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@incubator.com",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+1 (555) 000-0000",
  },
  {
    name: "incubator_name",
    label: "Incubator Name",
    placeholder: "e.g. BOCC Innovation Hub",
  },
  {
    name: "organization",
    label: "Parent Organization / Institution",
    placeholder: "e.g. Stanford University",
  },
  { name: "city", label: "City / Location", placeholder: "e.g. San Francisco" },
  {
    name: "website",
    label: "Website (Optional)",
    type: "url",
    placeholder: "https://...",
    colSpan: 2,
  },
];

export default function IncubatorSignupPage() {
  useDocumentTitle("Incubator Sign Up — BOCC");
  return (
    <RoleSignupForm
      roleId="incubator"
      title="Create Your Incubator Account"
      subtitle="Manage campus ecosystems and support founders end-to-end."
      icon={<Rocket size={22} strokeWidth={2} className="text-accent-neon" />}
      fields={FIELDS}
    />
  );
}
