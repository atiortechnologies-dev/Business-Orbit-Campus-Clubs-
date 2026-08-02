import { useState, useMemo } from 'react';
import { Users, Mail, UserCheck, Shield, Download, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminShell from '@/components/admin/AdminShell';
import DataTable from '@/components/ui/DataTable';
import Badge from '@/components/ui/Badge';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import Pagination from '@/components/ui/Pagination';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getAllUsers } from '@/api/admin/adminMiscApi';

const ROLE_VARIANT = { admin: 'warning', super_admin: 'error', student: 'neutral', chapter_lead: 'success', investor: 'success', mentor: 'success', company: 'neutral', incubator: 'warning' };
const STATUS_VARIANT = { active: 'success', inactive: 'neutral', pending: 'warning', suspended: 'error' };
const ROLE_OPTIONS = ['Role: All', 'student', 'chapter_lead', 'mentor', 'investor', 'company', 'incubator', 'admin'];
const STATUS_OPTIONS = ['Status: All', 'active', 'inactive', 'pending', 'suspended'];

const GROWTH = [24, 38, 52, 68, 44, 21];
const GROWTH_MONTHS = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];

export default function UserDirectoryPage() {
  useDocumentTitle('User Directory — BOCC Admin');

  const [roleFilter, setRoleFilter] = useState('Role: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [page, setPage] = useState(1);

  const { data: usersResponse, isLoading, isError, error } = useQuery({
    queryKey: ['adminUsersAll', page],
    queryFn: () => getAllUsers({ page, limit: 10 }),
  });

  const usersData = useMemo(() => {
    if (usersResponse?.data?.users) {
      return usersResponse.data.users.map(u => ({
        id: u._id,
        name: u.full_name || 'Unnamed',
        initial: (u.full_name || 'U').charAt(0).toUpperCase(),
        email: u.email,
        role: u.role,
        status: u.status || 'active',
        joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A',
      }));
    }
    return [];
  }, [usersResponse]);

  const visible = usersData.filter((u) => {
    if (statusFilter !== 'Status: All' && u.status !== statusFilter) return false;
    if (roleFilter !== 'Role: All' && u.role !== roleFilter) return false;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'User Name',
      width: '1.6fr',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-text-heading text-small shrink-0 select-none">
            {row.initial}
          </div>
          <span className="font-poppins font-semibold text-small text-text-heading">{row.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email', width: '1.6fr', className: 'text-text-body' },
    {
      key: 'role',
      label: 'Role',
      width: '1fr',
      render: (row) => <Badge variant={ROLE_VARIANT[row.role] || 'neutral'}>{row.role}</Badge>,
    },
    { key: 'joined', label: 'Joined', width: '1fr', className: 'text-text-body' },
    {
      key: 'status',
      label: 'Status',
      width: '0.8fr',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <AdminShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-semibold text-page text-text-heading">User Directory</h1>
          <p className="font-inter text-body text-text-body mt-1">
            Browse and manage all registered users across the platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={usersData.length.toString()} icon={<Users size={16} strokeWidth={2} />} trendDirection="up" />
        <StatCard label="Active Users" value={usersData.filter(u => u.status === 'active').length.toString()} icon={<UserCheck size={16} strokeWidth={2} />} />
        <StatCard label="Admin Users" value={usersData.filter(u => ['admin', 'super_admin'].includes(u.role)).length.toString()} icon={<Shield size={16} strokeWidth={2} />} />
        <StatCard label="Pending/Suspended" value={usersData.filter(u => ['pending', 'suspended'].includes(u.status)).length.toString()} icon={<Mail size={16} strokeWidth={2} />} />
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-surface-white border border-border-subtle rounded-lg p-4 mb-6 shadow-card">
        <div className="flex items-center gap-2">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">Filter by</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
          >
            {ROLE_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
          </select>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-brand-black"
        >
          {STATUS_OPTIONS.map((opt) => <option key={opt}>{opt}</option>)}
        </select>
        <ComingSoon label="Export Users" position="bottom" inline className="ml-auto p-2 border border-border-subtle rounded-md text-text-muted hover:bg-canvas-bg transition-colors">
          <Download size={18} strokeWidth={2} />
        </ComingSoon>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-brand-black animate-spin" />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-error/10 text-error rounded-lg border border-error/20 mb-8">
          <p className="font-poppins font-semibold text-body">Failed to load users.</p>
          <p className="font-inter text-small mt-2">{error.message || 'Please try again later.'}</p>
        </div>
      ) : (
        <>
          <DataTable columns={columns} rows={visible} emptyMessage="No users match the current filters." />
          <Pagination 
            currentPage={page} 
            totalPages={usersResponse?.data?.total_pages || 1} 
            onPageChange={setPage} 
          />
          <p className="font-inter text-small text-text-muted mt-4 mb-8 text-center">
            Showing {visible.length} entries (Page {page} of {usersResponse?.data?.total_pages || 1})
          </p>
        </>
      )}

    </AdminShell>
  );
}
