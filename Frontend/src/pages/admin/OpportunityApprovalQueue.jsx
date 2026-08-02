import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCheck, Eye, Check, X, Hourglass, Verified, Ban, FileText, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import Pagination from '@/components/ui/Pagination';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getOpportunitiesQueue } from '@/api/admin/adminMiscApi';

const STATUS_VARIANT = { Pending: 'warning', Approved: 'success', Rejected: 'error', Draft: 'neutral' };
const COMPANY_OPTIONS = ['All Companies', 'Quantas Systems', 'Neural Foundry', 'EcoRoots Global', 'DevOps Dynamics'];
const TYPE_OPTIONS = ['All Types', 'Internship', 'Job', 'Project', 'Collaboration'];
const STATUS_OPTIONS = ['All Statuses', 'Pending', 'Approved', 'Rejected', 'Draft'];

export default function OpportunityApprovalQueuePage() {
  useDocumentTitle('Opportunity Approval Queue — BOCC Admin');

  const [companyFilter, setCompanyFilter] = useState('All Companies');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [page, setPage] = useState(1);

  const { data: opportunitiesResponse, isLoading, isError, error } = useQuery({
    queryKey: ['adminOpportunities', page],
    queryFn: () => getOpportunitiesQueue({ page, limit: 10 }),
  });

  const opportunitiesData = useMemo(() => {
    if (opportunitiesResponse?.data?.opportunities) {
      return opportunitiesResponse.data.opportunities.map(opp => ({
        id: opp._id,
        title: opp.title,
        company: opp.company_id?.company_name || opp.company_id?.name || 'Unknown Company',
        type: opp.opportunity_type || 'Unknown',
        posted: new Date(opp.created_at).toLocaleDateString(),
        deadline: opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'No deadline',
        status: opp.status,
        reviewer: opp.reviewer_id?.name || null,
        reviewerInitials: opp.reviewer_id?.name ? opp.reviewer_id.name.substring(0, 2).toUpperCase() : null
      }));
    }
    return [];
  }, [opportunitiesResponse]);
  
  const metricCards = opportunitiesResponse?.data?.metricCards || { pending: 128, approved: 1240, rejected: 42, drafts: 18 };

  const visible = opportunitiesData.filter((o) => {
    if (companyFilter !== 'All Companies' && o.company !== companyFilter) return false;
    if (typeFilter !== 'All Types' && o.type !== typeFilter) return false;
    if (statusFilter !== 'All Statuses' && o.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'title',
      label: 'Opportunity Title',
      width: '1.8fr',
      render: (row) => (
        <div>
          <p className="font-poppins font-semibold text-small text-text-heading">{row.title}</p>
          <p className="font-inter text-caption text-text-muted">{row.id || row._id}</p>
        </div>
      ),
    },
    { key: 'company', label: 'Company', width: '1.2fr', className: 'text-text-body' },
    {
      key: 'type',
      label: 'Type',
      width: '1fr',
      render: (row) => <span className="px-2 py-0.5 bg-canvas-bg rounded font-inter text-caption text-text-body border border-border-subtle">{row.type}</span>,
    },
    { key: 'posted', label: 'Posted', width: '1fr', className: 'text-text-body' },
    { key: 'deadline', label: 'Deadline', width: '1fr', className: 'text-text-body' },
    {
      key: 'status',
      label: 'Status',
      width: '0.9fr',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'reviewer',
      label: 'Reviewer',
      width: '1.1fr',
      render: (row) => row.reviewer ? (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-[9px] text-text-heading">{row.reviewerInitials || row.reviewer.charAt(0)}</div>
          <span className="font-inter text-small text-text-body">{row.reviewer}</span>
        </div>
      ) : (
        <span className="font-inter text-small text-text-muted italic">Unassigned</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '1.1fr',
      mobileLabel: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <Link to={`/admin/opportunities/review?id=${row.id || row._id}`} className="p-1.5 rounded-md text-text-muted hover:text-text-heading hover:bg-canvas-bg transition-colors" title="View Details">
            <Eye size={16} strokeWidth={2} />
          </Link>
          <ComingSoon label="Approve" position="top" inline className="p-1.5 rounded-md text-success hover:bg-success/10 transition-colors">
            <Check size={16} strokeWidth={2} />
          </ComingSoon>
          <ComingSoon label="Reject" position="top" inline className="p-1.5 rounded-md text-error hover:bg-error/10 transition-colors">
            <X size={16} strokeWidth={2} />
          </ComingSoon>
        </div>
      ),
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">Opportunity Approval Queue</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Review, approve, or reject opportunities submitted by ecosystem partners.
          </p>
        </div>
        <div className="flex gap-2">
          <ComingSoon label="Export List" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-surface-white border border-border-subtle px-4 py-2 rounded-lg text-text-heading font-poppins font-semibold text-small">
              <Download size={14} strokeWidth={2} /> Export List
            </span>
          </ComingSoon>
          <ComingSoon label="Bulk Approve" position="bottom" inline>
            <span className="flex items-center gap-1.5 bg-action-bg text-action-text px-4 py-2 rounded-lg font-poppins font-semibold text-small">
              <CheckCheck size={14} strokeWidth={2} /> Bulk Approve
            </span>
          </ComingSoon>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Reviews" value={metricCards.pending.toString()} icon={<Hourglass size={16} strokeWidth={2} />} subtext="+12% from yesterday" trendDirection="up" />
        <StatCard label="Approved" value={metricCards.approved.toString()} icon={<Verified size={16} strokeWidth={2} />} subtext="System healthy" />
        <StatCard label="Rejected" value={metricCards.rejected.toString()} icon={<Ban size={16} strokeWidth={2} />} subtext="+3 reported issues" />
        <StatCard label="Drafts" value={metricCards.drafts.toString()} icon={<FileText size={16} strokeWidth={2} />} subtext="Expiring soon" />
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-surface-white border border-border-subtle rounded-lg p-4 mb-6 shadow-card">
        <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black">
          {COMPANY_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black">
          {TYPE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black">
          {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-brand-black animate-spin" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-error/10 text-error rounded-lg border border-error/20 mb-8">
          <p className="font-poppins font-semibold text-body">Failed to load opportunities.</p>
          <p className="font-inter text-small mt-2">{error.message || 'Please try again later.'}</p>
        </div>
      ) : (
        <>
          <DataTable columns={columns} rows={visible} emptyMessage="No opportunities match the current filters." />
          <Pagination 
            currentPage={page} 
            totalPages={opportunitiesResponse?.data?.total_pages || 1} 
            onPageChange={setPage} 
          />
          <p className="font-inter text-small text-text-muted mt-4 text-center">
            Showing {visible.length} entries (Page {page} of {opportunitiesResponse?.data?.total_pages || 1})
          </p>
        </>
      )}
    </AdminShell>
  );
}
