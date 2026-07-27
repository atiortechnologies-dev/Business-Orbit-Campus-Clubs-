import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Compass, MessageCircle, Calendar, Trash2 } from 'lucide-react';
import { freelancingService } from '@/lib/freelancingService';
import { useToast } from '@/components/ui/use-toast';
import ApplicationStatusBadge from '@/components/freelancing/ApplicationStatusBadge';
import ApplicationTimeline from '@/components/freelancing/ApplicationTimeline';

const TABS = [
  { key: 'active', label: 'Active', statuses: ['submitted', 'viewed', 'shortlisted', 'interview'] },
  { key: 'interviews', label: 'Interviews', statuses: ['interview'] },
  { key: 'selected', label: 'Selected', statuses: ['selected'] },
  { key: 'rejected', label: 'Rejected', statuses: ['rejected'] },
  { key: 'archived', label: 'Archived', statuses: ['withdrawn'] }
];

export default function MyApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    setLoading(true);
    freelancingService
      .getMyApplications()
      .then(setApplications)
      .catch(() => toast({ title: 'Error', description: 'Could not load applications.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  };

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.key === activeTab);
    return applications.filter((a) => tab.statuses.includes(a.status));
  }, [applications, activeTab]);

  const handleWithdraw = async () => {
    if (!withdrawTarget) return;
    setWithdrawing(true);
    try {
      await freelancingService.withdrawApplication(withdrawTarget.id);
      toast({ title: 'Application Withdrawn', description: 'Your application has been withdrawn.' });
      setWithdrawTarget(null);
      loadApplications();
    } catch {
      toast({ title: 'Error', description: 'Could not withdraw application.', variant: 'destructive' });
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/freelancing" className="hover:text-slate-600">Freelancing</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-slate-600">Opportunities</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-medium">My Applications</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">My Applications</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor the status of every opportunity you've applied for.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto">
        {TABS.map((tab) => {
          const count = applications.filter((a) => tab.statuses.includes(a.status)).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'text-slate-900 border-b-2 border-slate-900 -mb-px'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Application Cards */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-400 text-sm">No applications in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const initial = app.company?.[0] || 'C';
            return (
              <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="grid lg:grid-cols-[280px_1fr_auto] gap-5 items-center">
                  {/* Left: info */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {app.company_logo ? (
                        <img src={app.company_logo} alt={app.company} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-slate-500">{initial}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{app.job_title}</h3>
                      <p className="text-sm text-slate-500 truncate">{app.company}</p>
                      {app.applied_date && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px]">
                          Applied {app.applied_date}
                        </span>
                      )}
                      <div className="mt-2">
                        <ApplicationStatusBadge status={app.status} />
                      </div>
                    </div>
                  </div>

                  {/* Center: timeline */}
                  <div className="hidden lg:flex items-center justify-center px-4">
                    <ApplicationTimeline status={app.status} />
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <Link
                      to={`/freelancing/opportunity/${app.opportunity_id}`}
                      className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      View Application
                    </Link>
                    {app.status === 'interview' ? (
                      <Link
                        to={`/freelancing/interview/${app.id}`}
                        className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Call
                      </Link>
                    ) : (
                      <button className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Open Chat
                      </button>
                    )}
                    {!['withdrawn', 'rejected', 'selected'].includes(app.status) && (
                      <button
                        onClick={() => setWithdrawTarget(app)}
                        className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {/* Mobile timeline */}
                <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 overflow-x-auto">
                  <ApplicationTimeline status={app.status} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <p className="text-sm text-slate-400">Applying for more helps you stay on track.</p>
        <Link
          to="/freelancing"
          className="h-10 px-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Compass className="w-4 h-4" />
          Browse More Opportunities
        </Link>
      </div>

      {/* Withdraw Confirmation Dialog */}
      {withdrawTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setWithdrawTarget(null)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 text-center">Withdraw Application?</h3>
            <p className="text-sm text-slate-500 text-center mt-2">
              You're about to withdraw your application for <span className="font-medium text-slate-700">{withdrawTarget.job_title}</span> at {withdrawTarget.company}. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setWithdrawTarget(null)}
                className="flex-1 h-10 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="flex-1 h-10 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {withdrawing ? 'Withdrawing...' : 'Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}