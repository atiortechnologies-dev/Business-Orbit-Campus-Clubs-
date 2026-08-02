import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Send, Eye, Edit, Copy, PlusCircle, ArrowLeft } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FALLBACK_TITLE = 'Campus-Wide Policy Update: Semester II 2024';

export default function AnnouncementPublishedPage() {
  useDocumentTitle('Announcement Published — BOCC Admin');
  const { state } = useLocation();
  const draft = state?.draft;
  const title = draft?.title || FALLBACK_TITLE;
  const audience = draft?.audience?.length ? draft.audience : ['All Users'];

  return (
    <AdminShell>
      <section className="bg-surface-white border border-border-subtle rounded-lg py-16 flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-black text-white flex items-center justify-center mb-6">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">
          Announcement Published Successfully
        </h1>
        <p className="font-inter text-body text-text-body max-w-md">
          The system has finalized the broadcast across all designated campus channels and member devices.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-divider-line">
              <span className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest">Broadcast Manifest</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-black text-white font-inter text-[10px] font-semibold rounded uppercase">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Status: Live
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Subject Title</p>
                <p className="font-poppins font-semibold text-card text-text-heading">{title}</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Target Audience</p>
                <div className="flex flex-wrap gap-2">
                  {audience.map((a) => (
                    <span key={a} className="px-2 py-0.5 border border-border-subtle rounded font-inter text-[10px] font-semibold uppercase text-text-muted">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Published Time</p>
                <p className="font-inter text-small text-text-heading">Just now</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase mb-1">Notification Profile</p>
                <p className="flex items-center gap-2 font-inter text-small text-text-heading">
                  <Send size={16} strokeWidth={2} className="text-text-muted" /> Push, Email &amp; Dashboard
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-divider-line">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="font-inter text-caption text-text-muted uppercase mb-1">Estimated Reach</p>
                  <p className="font-poppins font-semibold text-section text-text-heading">12,450 <span className="font-inter font-normal text-small text-text-muted">Identities</span></p>
                </div>
                <p className="font-inter font-semibold text-small text-text-heading">98.2% Delivery Reliability</p>
              </div>
              <div className="w-full h-3 bg-canvas-bg rounded-full overflow-hidden">
                <div className="h-full bg-brand-black rounded-full" style={{ width: '98.2%' }} />
              </div>
              <p className="mt-2 font-inter text-caption text-text-muted">
                Real-time engagement telemetry will appear in the Reports module within 15 minutes.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-widest px-1 mb-1">Quick Actions</h3>
          <ComingSoon label="View Announcement" position="top" className="flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface-white">
            <span className="font-poppins font-semibold text-body text-text-heading">View Announcement</span>
            <Eye size={18} strokeWidth={2} className="text-text-muted" />
          </ComingSoon>
          <ComingSoon label="Edit Announcement" position="top" className="flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface-white">
            <span className="font-inter text-body text-text-body">Edit Announcement</span>
            <Edit size={18} strokeWidth={2} className="text-text-muted" />
          </ComingSoon>
          <ComingSoon label="Duplicate Announcement" position="top" className="flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface-white">
            <span className="font-inter text-body text-text-body">Duplicate Announcement</span>
            <Copy size={18} strokeWidth={2} className="text-text-muted" />
          </ComingSoon>
          <Link to="/admin/announcements/create" className="flex items-center justify-between p-4 border border-border-subtle rounded-lg bg-surface-white hover:bg-canvas-bg transition-colors">
            <span className="font-inter font-semibold text-body text-text-heading">Create New Announcement</span>
            <PlusCircle size={18} strokeWidth={2} className="text-text-muted" />
          </Link>
          <div className="pt-2">
            <Link
              to="/admin/announcements"
              className="flex items-center justify-center gap-2 w-full p-4 border-2 border-brand-black rounded-lg font-poppins font-semibold text-body text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <ArrowLeft size={18} strokeWidth={2} /> Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
