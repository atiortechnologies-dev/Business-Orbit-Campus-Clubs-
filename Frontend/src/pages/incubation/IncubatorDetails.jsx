import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight, MapPin, Calendar, Globe, Check, Users, Clock,
  TrendingUp, Award, Building2, Headphones, Rocket, FileText, Coins
} from 'lucide-react';
import { incubationService } from '@/lib/incubationService';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/incubation/StatusBadge';
import { Skeleton } from '@/components/incubation/Skeleton';

function DetailCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
      </div>
      <div className="text-sm text-slate-500 leading-relaxed">{children}</div>
    </div>
  );
}

export default function IncubatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inc, setInc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incubationService
      .getIncubator(id)
      .then(setInc)
      .catch(() => toast({ title: 'Error', description: 'Incubator not found.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-40 w-full" /></div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!inc) return null;

  const timelineIcons = [FileText, Users, Rocket];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/incubators" className="hover:text-slate-700">Incubators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-700">{inc.name}</span>
      </nav>

      {/* Hero banner with white card overlay */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200">
        <div className="h-48 sm:h-56 w-full">
          {inc.hero_image ? (
            <img src={inc.hero_image} alt="" className="w-full h-full object-cover" />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="relative bg-white px-5 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              {inc.logo ? (
                <img src={inc.logo} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Rocket className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{inc.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{inc.location}</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">EST. {inc.established_year}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 sm:shrink-0">
            {inc.website && (
              <a href={inc.website} target="_blank" rel="noreferrer" className="h-9 px-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            )}
            <button
              onClick={() => navigate(`/incubators/${inc.id}/apply`)}
              className="h-9 px-5 inline-flex items-center rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Apply to Incubator
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-2">About {inc.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{inc.about || inc.description}</p>
          </div>

          {/* Details grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <DetailCard icon={Check} title="Program Overview">
              <ul className="space-y-2">
                {(inc.program_overview || []).map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </DetailCard>
            <DetailCard icon={Building2} title="Facilities">
              <div className="flex flex-wrap gap-2">
                {(inc.facilities || []).map((f, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">{f}</span>
                ))}
              </div>
            </DetailCard>
            <DetailCard icon={Users} title="Mentorship">
              {inc.mentorship}
            </DetailCard>
            <DetailCard icon={Coins} title="Funding">
              {inc.funding_info}
            </DetailCard>
          </div>

          {/* Timeline */}
          {(inc.timeline || []).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-5">Cohort Timeline</h3>
              <div className="space-y-0">
                {inc.timeline.map((step, i) => {
                  const Icon = timelineIcons[i % timelineIcons.length];
                  const last = i === inc.timeline.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        {!last && <div className="w-px flex-1 bg-slate-200 my-1" />}
                      </div>
                      <div className={`pb-6 ${last ? 'pb-0' : ''}`}>
                        <p className="font-medium text-slate-900 text-sm">{step.stage}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alumni */}
          {(inc.alumni || []).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Alumni Startups</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {inc.alumni.map((a, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 h-20 flex items-center justify-center">
                    <span className="italic text-slate-400 text-sm font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20 space-y-4">
            <div className="flex items-center justify-between">
              <StatusBadge status={inc.status} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div><p className="text-[11px] uppercase text-slate-400">Deadline</p><p className="text-slate-700 font-medium">{inc.deadline}</p></div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Users className="w-4 h-4 text-slate-400" />
                <div><p className="text-[11px] uppercase text-slate-400">Seats Available</p><p className="text-slate-700 font-medium">{inc.seats_available}</p></div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <div><p className="text-[11px] uppercase text-slate-400">Target Stage</p><p className="text-slate-700 font-medium">{inc.target_stage}</p></div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate(`/incubators/${inc.id}/apply`)}
                className="w-full h-10 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Apply to Incubator
              </button>
              <button className="w-full h-10 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                Save for Later
              </button>
            </div>
          </div>

          {(inc.perks || []).length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="font-semibold text-slate-900 text-sm mb-3">Program Perks</h4>
              <ul className="space-y-2.5">
                {inc.perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <Award className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-blue-100 bg-[#EBF0F7] p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-white border border-blue-100 mx-auto flex items-center justify-center mb-2">
              <Headphones className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-slate-800">Have Questions?</p>
            <p className="text-xs text-slate-500 mt-1 mb-3">Schedule a quick 15-min call with our team.</p>
            <button className="w-full h-9 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
              Book Office Hours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}