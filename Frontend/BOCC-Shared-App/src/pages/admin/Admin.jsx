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

const FUNNEL = [
  { label: 'Idea', value: 1240 },
  { label: 'Validation', value: 840 },
  { label: 'MVP', value: 456 },
  { label: 'Traction', value: 182 },
  { label: 'Launch', value: 42 },
];
const FUNNEL_MAX = FUNNEL[0].value;

const ACTIVITY_STREAM = [
  { icon: RefreshCw, text: 'System Upgrade Complete', time: '12m ago' },
  { icon: UserPlus, text: 'New User Registered', time: '38m ago' },
  { icon: Upload, text: 'Bulk Export Initiated', time: '1h ago' },
  { icon: FolderPlus, text: 'Club Created "Fintech 2024"', time: '3h ago' },
];

export default function AdminDashboardPage() {
  useDocumentTitle('BOCC Command Center — Admin Dashboard');

  return (
    <AdminShell>
      {/* ── KPI row ─────────────────────────────────────────────────── */}
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
        {/* User Distribution */}
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

        {/* Startup Journey Funnel */}
        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Startup Journey Funnel</h3>
            <div className="flex items-center gap-1 bg-canvas-bg rounded-md p-1">
              <span className="px-3 py-1 rounded font-inter font-medium text-caption bg-surface-white text-text-heading shadow-sm">Daily</span>
              <ComingSoon label="Monthly view" position="bottom" inline>
                <span className="px-3 py-1 rounded font-inter font-medium text-caption text-text-muted">Monthly</span>
              </ComingSoon>
            </div>
          </div>
          <div className="flex items-end gap-3 h-32 mb-3">
            {FUNNEL.map(({ label, value }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <span className="font-inter font-semibold text-caption text-text-heading">{value.toLocaleString()}</span>
                <div
                  className="w-full bg-brand-black rounded-t"
                  style={{ height: `${Math.max((value / FUNNEL_MAX) * 100, 4)}%` }}
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
        {/* Critical Actions */}
        <section className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Critical Actions</h3>
          </div>
          <div className="divide-y divide-border-subtle">
            <div className="p-6 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
                <AlertTriangle size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-semibold text-body text-text-heading">Identity Verification Loophole</p>
                <p className="font-inter text-small text-text-muted">14 records flagged in batch #482</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to="/admin/verification" className="px-3 py-1.5 bg-action-bg text-action-text rounded-md font-inter font-medium text-caption hover:opacity-90 transition-opacity">
                  Review
                </Link>
                <ComingSoon label="Ignore" position="top" inline>
                  <span className="px-3 py-1.5 border border-border-subtle rounded-md font-inter font-medium text-caption text-text-muted">
                    Ignore
                  </span>
                </ComingSoon>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-warning/15 text-warning flex items-center justify-center shrink-0">
                <FileText size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-semibold text-body text-text-heading">Compliance Report Due</p>
                <p className="font-inter text-small text-text-muted">Quarterly submission due in 3 days</p>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-info/15 text-info flex items-center justify-center shrink-0">
                <UserPlus size={18} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter font-semibold text-body text-text-heading">New Mentor Application</p>
                <p className="font-inter text-small text-text-muted">Dr. Sarah Jenkins awaiting approval</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Stream */}
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

      {/* Upcoming Cycle — inverted panel */}
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
