import DashboardShell from "@/components/dashboard/DashboardShell";

export default function CompanyDashboardShell({
  children,
  pageId = "company",
}) {
  return (
    <DashboardShell pageId={pageId}>
      {children}
    </DashboardShell>
  );
}