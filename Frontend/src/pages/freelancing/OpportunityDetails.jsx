import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Check, Star, ArrowRight, Bookmark, Share2,
  Globe, Briefcase, Users, Calendar, Clock, ChevronRight
} from 'lucide-react';
import { freelancingService } from '@/lib/freelancingService';
import { useToast } from '@/components/ui/use-toast';

function MetaRow({ icon: Icon, label, value, bold }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-500 flex items-center gap-2">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </span>
      <span className={`text-sm ${bold ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{value}</span>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opp, setOpp] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      freelancingService.getOpportunity(id),
      freelancingService.getSimilarOpportunities(id, null, 3)
    ])
      .then(([data, sim]) => {
        setOpp(data);
        setSimilar(sim);
      })
      .catch(() => toast({ title: 'Error', description: 'Could not load opportunity.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 h-32 animate-pulse" />
            ))}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!opp) return null;

  const initial = opp.company?.[0] || 'C';

  const handleSave = () => toast({ title: 'Saved', description: 'Opportunity saved to your list.' });
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: opp.job_title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link Copied', description: 'Share this opportunity with your network.' });
    }
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/freelancing" className="hover:text-slate-600">Freelancing</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="hover:text-slate-600">Opportunities</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-700 font-medium">Opportunity Detail</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Main content */}
        <div className="space-y-5">
          {/* Header card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{opp.job_title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {opp.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {opp.location} {opp.work_mode && `(${opp.work_mode})`}
              </span>
            </div>
            {opp.pay_range && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-sm">
                <span className="font-semibold text-slate-800">{opp.pay_range}</span>
                {opp.opportunity_type && <span className="text-slate-400">· {opp.opportunity_type}</span>}
              </div>
            )}
          </div>

          {opp.company_description && (
            <SectionCard title="Company Overview">
              <p className="text-sm text-slate-600 leading-relaxed">{opp.company_description}</p>
            </SectionCard>
          )}

          {opp.description && (
            <SectionCard title="Opportunity Description">
              <p className="text-sm text-slate-600 leading-relaxed">{opp.description}</p>
            </SectionCard>
          )}

          {opp.responsibilities?.length > 0 && (
            <SectionCard title="Responsibilities">
              <ul className="space-y-2.5">
                {opp.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-slate-600" />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {opp.skills?.length > 0 && (
            <SectionCard title="Required Skills">
              <div className="flex flex-wrap gap-2">
                {opp.skills.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </SectionCard>
          )}

          {opp.eligibility && (
            <SectionCard title="Eligibility">
              <p className="text-sm text-slate-600 leading-relaxed">{opp.eligibility}</p>
            </SectionCard>
          )}

          {opp.preferred_qualifications?.length > 0 && (
            <SectionCard title="Preferred Qualifications">
              <ul className="space-y-2.5">
                {opp.preferred_qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    {q}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {opp.about_company && (
            <SectionCard title={`About ${opp.company}`}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                  {opp.company_logo ? (
                    <img src={opp.company_logo} alt={opp.company} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-7 h-7 text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{opp.about_company}</p>
              </div>
            </SectionCard>
          )}

          {/* Similar Opportunities */}
          {similar.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900">Similar Opportunities</h2>
                <Link to="/freelancing" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    to={`/freelancing/opportunity/${s.id}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-slate-300 transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">{s.job_title}</p>
                    <p className="text-xs text-slate-400 truncate">{s.company}</p>
                    {s.pay_range && <p className="text-xs text-slate-500 mt-1">{s.pay_range}</p>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                {opp.company_logo ? (
                  <img src={opp.company_logo} alt={opp.company} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-slate-500">{initial}</span>
                )}
              </div>
              <p className="mt-2.5 font-semibold text-slate-900">{opp.company}</p>
              {opp.company_type && <p className="text-xs text-slate-400">{opp.company_type}</p>}
            </div>

            <div className="py-2">
              {opp.company_website && <MetaRow icon={Globe} label="Website" value={opp.company_website} />}
              {opp.industry && <MetaRow icon={Briefcase} label="Industry" value={opp.industry} />}
              {opp.company_size && <MetaRow icon={Users} label="Company Size" value={opp.company_size} />}
              {opp.posted_date && <MetaRow icon={Calendar} label="Posted Date" value={opp.posted_date} />}
              {opp.deadline && <MetaRow icon={Clock} label="Deadline" value={opp.deadline} bold />}
            </div>

            <div className="pt-4 space-y-2.5">
              <button
                onClick={() => navigate(`/freelancing/opportunity/${opp.id}/apply`)}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Save Opportunity
              </button>
              <button
                onClick={handleShare}
                className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {opp.applicants_count && (
              <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-center">
                <p className="text-xs text-blue-600">
                  <span className="font-semibold">{opp.applicants_count}</span> students from BOCC have already applied
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}