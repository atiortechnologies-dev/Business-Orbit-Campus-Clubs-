import { Image as ImageIcon } from 'lucide-react';
import CompanyShell from '@/components/company/CompanyShell';
import StatsRow from '@/components/company/StatsRow';
import ApplicantTable from '@/components/company/ApplicantTable';
import RightPanel from '@/components/company/RightPanel';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function CompanyDashboardPage() {
  useDocumentTitle('Company Dashboard — BOCC');

  return (
    <CompanyShell>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading">
            Welcome back, Acme Corp
          </h1>
          <p className="font-inter text-body text-text-muted mt-1.5">
            Here is a snapshot of your current hiring pipeline and activity.
          </p>
        </div>
        <div className="w-full lg:w-64 h-32 placeholder-box rounded-xl flex items-center justify-center shrink-0">
          <ImageIcon size={32} strokeWidth={2} className="text-text-muted" />
        </div>
      </div>

      <div className="mb-8">
        <StatsRow />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ApplicantTable />
        </div>
        <div className="lg:col-span-1">
          <RightPanel />
        </div>
      </div>
    </CompanyShell>
  );
}
