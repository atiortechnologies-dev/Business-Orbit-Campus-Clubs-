import { useState } from 'react';
import {
  Users,
  Rocket,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  UserPlus,
  ArrowRight,
  RefreshCw,
  Upload,
  FolderPlus,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminShell from '@/components/admin/AdminShell';
import StatCard from '@/components/ui/StatCard';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const USER_DISTRIBUTION = [
  { label: 'Students', pct: 65 },
  { label: 'Mentors', pct: 20 },
  { label: 'Investors', pct: 15 },
];

const FUNNEL_VIEWS = {
  Daily: [
    { label: 'Idea', value: 1240 },
    { label: 'Validation', value: 840 },
    { label: 'MVP', value: 456 },
    { label: 'Traction', value: 182 },
    { label: 'Launch', value: 42 },
  ],
  Monthly: [
    { label: 'Idea', value: 5180 },
    { label: 'Validation', value: 3420 },
    { label: 'MVP', value: 1890 },
    { label: 'Traction', value: 705 },
    { label: 'Launch', value: 168 },
  ],
};

const ACTIVITY_STREAM = [
  { icon: RefreshCw, text: 'System Upgrade Complete', time: '12m ago' },
  { icon: UserPlus, text: 'New User Registered', time: '38m ago' },
  { icon: Upload, text: 'Bulk Export Initiated', time: '1h ago' },
  { icon: FolderPlus, text: 'Club Created "Fintech 2024"', time: '3h ago' },
];

const INITIAL_CRITICAL_ACTIONS = [
  {
    id: 'ca1',
    icon: AlertTriangle,
    tone: 'error',
    title: 'Identity Verification Loophole',
    detail: '14 records flagged in batch #482',
    reviewHref: '/admin/verification',
  },
  {
    id: 'ca2',
    icon: FileText,
    tone: 'warning',
    title: 'Compliance Report Due',
    detail: 'Quarterly submission due in 3 days',
  },
  {
    id: 'ca3',
    icon: UserPlus,
    tone: 'info',
    title: 'New Mentor Application',
    detail: 'Dr. Sarah Jenkins awaiting approval',
  },
];

const TONE_CLASSES = {
  error: 'bg-error/15 text-error',
  warning: 'bg-warning/15 text-warning',
  info: 'bg-info/15 text-info',
};

export default function AdminDashboardPage() {
  useDocumentTitle('BOCC Command Center — Admin Dashboard');
  const [funnelView, setFunnelView] = useState('Daily');
  const [criticalActions, setCriticalActions] = useState(INITIAL_CRITICAL_ACTIONS);

  const funnel = FUNNEL_VIEWS[funnelView];
  const funnelMax = funnel[0].value;

  // TODO(backend): PATCH this critical action as acknowledged server-side
  // (e.g. { actionId: id, status: 'dismissed' }) so it doesn't reappear
  // for this admin on next load — the local removal below is optimistic.
  const dismissAction = (id) => setCriticalActions((prev) => prev.filter((a) => a.id !== id));

  return (
    <AdminShell>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value="12,482" icon={<Users size={18} strokeWidth={2} />} subtext="+8.4% this month" trendDirection="up" />
        <StatCard label="Active Startups" value="456" icon={<Rocket size={18} strokeWidth={2} />} subtext="92% engagement" />
        <StatCard
          label="Pending Verifications"
          value="24"
          icon={<ShieldAlert size={18} strokeWidth={2} />}
          subtext="8 critical alerts"
          trendDirection="down"
          className="border-error/40"
        />
        <StatCard label="Investor Capital" value="$24.8M" icon={<DollarSign size={18} strokeWidth={2} />} subtext="Tracked across all rounds" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <section className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <h3 className="font-poppins font-semibold text-card text-text-heading mb-6">User Distribution</h3>
          <div className="space-y-4 mb-6">
            {USER_DISTRIBUTION.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-inter text-small text-text-body">{label}</span>
                  <span className="font-inter font-semibold text-small text-text-heading">{pct}%</span>
                </div>
                <div className="w-full bg-divider-line h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-black h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <ComingSoon label="Demographic Map" position="top">
            <div className="w-full h-32 placeholder-box rounded-lg" />
          </ComingSoon>
        </section>

        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Startup Journey Funnel</h3>
            <div className="flex items-center gap-1 bg-canvas-bg rounded-md p-1">
              {Object.keys(FUNNEL_VIEWS).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setFunnelView(view)}
                  className={`px-3 py-1 rounded font-inter font-medium text-caption transition-colors ${
                    funnelView === view ? 'bg-surface-white text-text-heading shadow-sm' : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-32 mb-3">
            {funnel.map(({ label, value }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <span className="font-inter font-semibold text-caption text-text-heading">{value.toLocaleString()}</span>
                <div
                  className="w-full bg-brand-black rounded-t transition-all"
                  style={{ height: `${Math.max((value / funnelMax) * 100, 4)}%` }}
                />
                <span className="font-inter text-caption text-text-muted">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-divider-line">
            <div className="flex gap-6">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">Conversion Rate</p>
                <p className="font-poppins font-semibold text-body text-text-heading">3.4%</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted uppercase">Avg. Time to MVP</p>
                <p className="font-poppins font-semibold text-body text-text-heading">114 Days</p>
              </div>
            </div>
            <ComingSoon label="Drop-off report" position="top" inline>
              <span className="flex items-center gap-1 font-inter font-medium text-small text-text-body hover:text-text-heading transition-colors">
                View detailed drop-off report <ArrowRight size={14} strokeWidth={2} />
              </span>
            </ComingSoon>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Critical Actions</h3>
          </div>
          {criticalActions.length === 0 ? (
            <p className="p-6 font-inter text-small text-text-muted">No critical actions — you're all caught up.</p>
          ) : (
            <div className="divide-y divide-border-subtle">
              {criticalActions.map(({ id, icon: Icon, tone, title, detail, reviewHref }) => (
                <div key={id} className="p-6 flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${TONE_CLASSES[tone]}`}>
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-semibold text-body text-text-heading">{title}</p>
                    <p className="font-inter text-small text-text-muted">{detail}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {reviewHref && (
                      <Link to={reviewHref} className="px-3 py-1.5 bg-action-bg text-action-text rounded-md font-inter font-medium text-caption hover:opacity-90 transition-opacity">
                        Review
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => dismissAction(id)}
                      className="px-3 py-1.5 border border-border-subtle rounded-md font-inter font-medium text-caption text-text-muted hover:bg-canvas-bg hover:text-text-heading transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Activity Stream</h3>
          </div>
          <div className="divide-y divide-border-subtle">
            {ACTIVITY_STREAM.map(({ icon: Icon, text, time }) => (
              <div key={text} className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center text-text-muted shrink-0">
                  <Icon size={16} strokeWidth={2} />
                </div>
                <p className="flex-1 font-inter text-small text-text-body">{text}</p>
                <span className="font-inter text-caption text-text-muted whitespace-nowrap">{time}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-brand-black text-white rounded-lg p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-poppins font-semibold text-card mb-4">Upcoming Cycle</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar size={16} strokeWidth={2} className="text-white/60 shrink-0" />
                <p className="font-inter text-small flex-1">Advisory Board Sync — Today, 14:00</p>
                <div className="flex -space-x-2" aria-hidden="true">
                  {['S', 'M', 'E'].map((letter, i) => (
                    <span
                      key={letter}
                      className="w-6 h-6 rounded-full bg-white/10 border-2 border-brand-black flex items-center justify-center text-[10px] font-semibold"
                      style={{ zIndex: 3 - i }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} strokeWidth={2} className="text-white/60 shrink-0" />
                <p className="font-inter text-small flex-1">Investor Showcase Review — Tomorrow, 10:30 AM</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <div className="flex justify-between mb-1.5">
              <span className="font-inter text-caption text-white/70 uppercase tracking-wider">System Integrity</span>
              <span className="font-inter font-semibold text-caption">99.98%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div className="bg-accent-neon h-full rounded-full" style={{ width: '99.98%' }} />
            </div>
            <p className="font-inter text-caption text-white/50 mt-1.5">Uptime, last 30 days</p>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
