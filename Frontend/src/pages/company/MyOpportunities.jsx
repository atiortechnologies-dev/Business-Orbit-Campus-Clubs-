import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompanyShell from '@/components/company/CompanyShell';
import OpportunitiesTable from '@/components/company/OpportunitiesTable';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function MyOpportunitiesPage() {
  useDocumentTitle('My Opportunities — BOCC Company Portal');

  return (
    <CompanyShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading">
            My Opportunities
          </h1>
          <p className="font-inter text-body text-text-muted mt-1">
            Manage all your posted opportunities.
          </p>
        </div>

        <Link to="/company/post-opportunity/step-1" className="flex items-center justify-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2.5 rounded-lg hover:opacity-90 transition-all">
          <Plus size={16} strokeWidth={2} />
          New Opportunity
        </Link>
      </div>

      <OpportunitiesTable />
    </CompanyShell>
  );
}
