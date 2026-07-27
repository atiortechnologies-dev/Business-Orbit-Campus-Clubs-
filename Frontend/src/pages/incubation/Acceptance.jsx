import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PartyPopper, Download, ArrowLeft, FileText, BookOpen, Mail,
  Phone, Globe, User, Info, CheckCircle2, ShieldCheck
} from 'lucide-react';
import { incubationService } from '@/lib/incubationService';
import { Skeleton } from '@/components/incubation/Skeleton';
import { motion } from 'framer-motion';

export default function Acceptance() {
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incubationService
      .getMyApplications()
      .then((data) => {
        const accepted = data.find((a) => a.status === 'accepted') || data[0];
        setApp(accepted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-6"><Skeleton className="h-64 lg:col-span-2" /><Skeleton className="h-64" /></div>
      </div>
    );
  }

  const documents = [
    { name: 'Incubation Acceptance Letter', icon: FileText, date: app?.acceptance_date || 'Oct 24, 2023' },
    { name: 'Offer Letter', icon: FileText, date: app?.acceptance_date || 'Oct 24, 2023' },
    { name: 'Program Handbook', icon: BookOpen, date: app?.acceptance_date || 'Oct 24, 2023' }
  ];

  const summary = [
    { label: 'Startup Name', value: app?.startup_name || 'EcoSphere Analytics' },
    { label: 'Incubator Name', value: app?.incubator_name || 'VelocityX Lab' },
    { label: 'Program Name', value: app?.program_name || 'Growth Catalyst Phase 1' },
    { label: 'Acceptance Date', value: app?.acceptance_date || 'October 24, 2023' },
    { label: 'Program Duration', value: app?.duration || '6 Months' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Congratulations banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-10 text-center text-white"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div
          initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.15, stiffness: 180 }}
          className="relative w-16 h-16 rounded-full bg-amber-400 mx-auto flex items-center justify-center mb-4"
        >
          <PartyPopper className="w-8 h-8 text-slate-900" />
        </motion.div>
        <h1 className="relative text-3xl sm:text-4xl font-bold">Congratulations!</h1>
        <p className="relative mt-2 text-lg text-slate-200">Your Startup Has Been Accepted for Incubation</p>
        <p className="relative mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Congratulations! Your startup has been accepted into the incubation program. We wish you success on your entrepreneurial journey.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: summary + documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Acceptance summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">Acceptance Summary</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Record
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {summary.map((row) => (
                <div key={row.label} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{row.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{row.value}</p>
                </div>
              ))}
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3.5">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Status</p>
                <p className="text-sm font-semibold text-emerald-600 mt-0.5 inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Accepted
                </p>
              </div>
            </div>
          </div>

          {/* Acceptance documents */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Acceptance Documents</h3>
            <div className="space-y-2">
              {documents.map((doc, i) => {
                const Icon = doc.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-400">Uploaded: {doc.date}</p>
                    </div>
                    <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Incubator Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-600"><User className="w-4 h-4 text-slate-400" /><div><p className="text-[11px] uppercase text-slate-400">Contact Person</p><p className="text-slate-700 font-medium">{app?.contact_person || 'Marcus Thorne'}</p></div></div>
              <div className="flex items-center gap-3 text-slate-600"><Mail className="w-4 h-4 text-slate-400" /><div><p className="text-[11px] uppercase text-slate-400">Email</p><p className="text-slate-700 font-medium">{app?.contact_email || 'contact@velocityxlab.com'}</p></div></div>
              <div className="flex items-center gap-3 text-slate-600"><Phone className="w-4 h-4 text-slate-400" /><div><p className="text-[11px] uppercase text-slate-400">Phone</p><p className="text-slate-700 font-medium">{app?.contact_phone || '+1 555-0123'}</p></div></div>
              <div className="flex items-center gap-3 text-slate-600"><Globe className="w-4 h-4 text-slate-400" /><div><p className="text-[11px] uppercase text-slate-400">Website</p><p className="text-slate-700 font-medium">{app?.contact_website || 'velocityxlab.com'}</p></div></div>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-5 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 leading-relaxed">Please keep your acceptance documents safe for future reference.</p>
          </div>

          <div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center">
            <p className="text-sm text-slate-500">Need help? Visit the <span className="font-semibold text-slate-700">Help Center</span> or message your mentor directly.</p>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" /> Download Documents
        </button>
        <button onClick={() => navigate('/')} className="h-11 px-6 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
}