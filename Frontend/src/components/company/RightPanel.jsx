import { Link } from 'react-router-dom';
import { Plus, FolderOpen, Users, FileText } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';
import Badge from '@/components/ui/Badge';

const POSTINGS = [
  { id: 1, title: 'Staff Backend Engineer', meta: 'Engineering • Remote • Full-time', status: 'ACTIVE', applicants: 42 },
  { id: 2, title: 'UX Researcher', meta: 'Design • New York • Contract', status: 'ACTIVE', applicants: 18 },
  { id: 3, title: 'Marketing Associate', meta: 'Growth • London • Full-time', status: 'DRAFT', applicants: null },
];

export default function RightPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-surface-white rounded-xl border border-border-subtle p-5">
        <h2 className="font-poppins font-bold text-body text-text-heading mb-4">Quick Actions</h2>
        <div className="space-y-2.5">
          <ComingSoon label="Post New Opportunity" position="top" className="w-full flex items-center justify-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small py-2.5 rounded-lg hover:opacity-90 transition-all">
            <Plus size={16} strokeWidth={2} />
            Post New Opportunity
          </ComingSoon>
          <Link
            to="/company/my-opportunities"
            className="w-full flex items-center justify-center gap-2 bg-surface-white border border-border-subtle text-text-heading font-poppins font-semibold text-small py-2.5 rounded-lg hover:bg-canvas-bg transition-colors"
          >
            <FolderOpen size={16} strokeWidth={2} />
            Manage Opportunities
          </Link>
          <ComingSoon label="View Applicants" position="top" className="w-full flex items-center justify-center gap-2 bg-surface-white border border-border-subtle text-text-heading font-poppins font-semibold text-small py-2.5 rounded-lg hover:bg-canvas-bg transition-colors">
            <Users size={16} strokeWidth={2} />
            View Applicants
          </ComingSoon>
        </div>
      </div>

      <div className="bg-surface-white rounded-xl border border-border-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle flex items-center gap-2">
          <FileText size={16} strokeWidth={2} className="text-text-muted" />
          <h2 className="font-poppins font-bold text-body text-text-heading">Latest Postings</h2>
        </div>
        <div className="divide-y divide-border-subtle">
          {POSTINGS.map((p) => (
            <div key={p.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-poppins font-semibold text-small text-text-heading">{p.title}</p>
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'neutral'}>{p.status}</Badge>
              </div>
              <p className="font-inter text-caption text-text-muted mt-1">{p.meta}</p>
              <p className="font-inter text-caption text-text-muted mt-2">
                {p.applicants !== null ? `${p.applicants} Applicants` : '— Applicants'}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 text-center border-t border-border-subtle">
          <Link to="/company/my-opportunities" className="font-inter text-caption font-bold tracking-wider text-text-muted hover:text-text-heading transition-colors">
            SEE ALL JOB POSTS
          </Link>
        </div>
      </div>
    </div>
  );
}
