import { Briefcase } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import FeatureLockedNotice from "@/components/ui/FeatureLockedNotice";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function FreelancingPage() {
  useDocumentTitle("Freelancing — BOCC");

  return (
    <DashboardShell>
      <FeatureLockedNotice
        icon={Briefcase}
        heading="Freelancing is coming soon"
        message="We're building this out — check back soon to browse and apply to freelance opportunities."
      />
    </DashboardShell>
  );
}
