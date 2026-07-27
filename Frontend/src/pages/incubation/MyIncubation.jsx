import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus, Calendar, Users, Clock, ChevronRight, FileText, Download,
  MessageSquare, Bell, Check, MapPin, Mail, Phone, Building2, AlertCircle
} from 'lucide-react';
import { incubationService } from '@/lib/incubationService';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/incubation/StatusBadge';
import { Skeleton } from '@/components/incubation/Skeleton';

const timelineStages = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'screening', label: 'Screening' },
  { key: 'review', label: 'Review' },
  { key: 'interview', label: 'Interview' },
  { key: 'accepted', label: 'Final Decision' }
];

export default function MyIncubation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incubationService
      .getMyApplications()
      .then((data) => {
        setApps(data);
        // Acceptance logic: redirect only when there is no in-progress application
        // and the latest application is accepted.
        const hasActive = data.some((a) => a.status !== 'withdrawn' && a.status !== 'accepted');
        const latest = data[0];
        if (!hasActive && latest && latest.status === 'accepted') {
          navigate('/my-incubation/accepted');
        }
      })
      .catch(() => toast({ title: 'Error', description: 'Could not load applications.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  const active = apps.find((a) => a.status !== 'withdrawn' && a.status !== 'accepted') || apps[0];
  const stageIndex = active ? timelineStages.findIndex((t) => t.key === active.status) : -1;

  const handleWithdraw = async () => {
    if (!active) return;
    try {
      await incubationService.withdrawApplication(active.id);
      toast({ title: 'Withdrawn', description: 'Your application has been withdrawn.' });
      setApps((a) => a.map((x) => (x.id === active.id ? { ...x, status: 'withdrawn', current_stage: 'Withdrawn' } : x)));
    } catch {
      toast({ title: 'Error', description: 'Could not withdraw.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-64 lg:col-span-2" /><Skeleton className="h-64" /></div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Applications Yet</h2>
        <p className="mt-2 text-sm text-slate-500">Browse incubators and submit your first application.</p>
        <Link to="/incubators" className="mt-5 inline-flex h-10 px-5 items-center rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
          Discover Incubators
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Incubation</h1>
          <p className="mt-1 text-sm text-slate-500">Track the progress of your startup submissions across various hubs.</p>
        </div>
        <Link to="/incubators" className="h-10 px-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left two columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active application */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Active Application</span>
              <StatusBadge status={active.status} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Startup', value: active.startup_name },
                { label: 'Incubator', value: active.incubator_name },
                { label: 'Applied Date', value: active.applied_date },
                { label: 'Current Stage', value: active.current_stage || active.status },
                { label: 'Lead Reviewer', value: active.reviewer || '—' },
                { label: 'Expected Decision', value: active.expected_decision || '—' }
              ].map((row) => (
                <div key={row.label}>
                  <p className="text-[11px] uppercase text-slate-400">{row.label}</p>
                  <p className="text-sm font-medium text-slate-800">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button className="h-9 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">View Meeting Details</button>
              <button onClick={handleWithdraw} className="h-9 px-4 rounded-lg border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors">Withdraw</button>
            </div>
          </div>

          {/* Incubator info */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Incubator Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600"><MapPin className="w-4 h-4 text-slate-400" /> Innovation District, Block C, Suite 402</div>
              <div className="flex items-center gap-3 text-slate-600"><Mail className="w-4 h-4 text-slate-400" /> {active.contact_email || 'contact@incubator.com'}</div>
              <div className="flex items-center gap-3 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /> {active.contact_phone || '+1 (555) 012-3456'}</div>
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <span className="font-medium">Office Hours:</span> Mon - Fri, 9:00 AM - 5:00 PM
            </div>
          </div>

          {/* Lower row */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Documents */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 text-sm">Uploaded Documents</h3>
                <button className="text-xs font-medium text-blue-600 hover:underline inline-flex items-center gap-1"><Plus className="w-3 h-3" /> Upload New</button>
              </div>
              <div className="space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[11px] uppercase text-slate-400 px-2 pb-2 border-b border-slate-100">
                  <span>Document Name</span><span>Type</span><span>Action</span>
                </div>
                {(active.documents || []).length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No documents uploaded.</p>
                ) : active.documents.map((d, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-2.5 text-sm border-b border-slate-50">
                    <span className="text-slate-700 truncate flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" />{d.name}</span>
                    <span className="text-slate-400 text-xs">{d.type}</span>
                    <a href={d.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-700"><Download className="w-4 h-4" /></a>
                  </div>
                ))}
              </div>
            </div>

            {/* Communication */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 text-sm mb-4">Communication</h3>
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-700">{active.reviewer || 'Reviewer'} <span className="text-xs text-slate-400">(Reviewer)</span></p>
                </div>
                <p className="text-xs text-slate-400 mb-2">Yesterday, 2:15 PM</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {(active.communication && active.communication[0]?.message) || "Hi there! We've received your pitch deck. Could you please clarify the market size assumptions on slide 8?"}
                </p>
              </div>
              <button className="mt-3 w-full h-9 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">Open Conversation</button>
            </div>
          </div>
        </div>

        {/* Right sidebar - status timeline */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-20">
            <h3 className="font-semibold text-slate-900 mb-1">Current Application Status</h3>
            <p className="text-sm text-slate-400 mb-1">{active.incubator_name}</p>
            <p className="text-xs text-slate-400 mb-5">{Math.round(((stageIndex + 1) / 5) * 100)}% Complete</p>
            <div className="space-y-0">
              {timelineStages.map((stage, i) => {
                const done = i < stageIndex;
                const current = i === stageIndex;
                const last = i === timelineStages.length - 1;
                return (
                  <div key={stage.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-emerald-500 text-white' : current ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {done ? <Check className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      {!last && <div className={`w-px flex-1 my-1 ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
                    </div>
                    <div className={`pb-5 ${last ? 'pb-0' : ''}`}>
                      <p className={`text-sm font-medium ${current ? 'text-slate-900' : done ? 'text-slate-700' : 'text-slate-400'}`}>{stage.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {done ? 'Complete' : current ? 'In Progress' : 'Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent updates */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-4">Recent Updates</h3>
            <div className="space-y-4">
              {(active.updates || [
                { text: 'Interview invite received from Skyline Ventures', time: '2 hours ago' },
                { text: 'Screening complete for EcoFlow Solutions', time: 'Yesterday, 4:20 PM' },
                { text: 'Application auto-saved for Global Impact Fund', time: 'Oct 25, 2023' },
                { text: 'Accepted into Blue Sky Lab Cohort \'24!', time: 'Oct 24, 2023' }
              ]).map((u, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 leading-snug">{u.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{u.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}