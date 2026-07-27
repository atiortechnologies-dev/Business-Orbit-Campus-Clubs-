import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Rocket, Users, Coins, FileText, Check, Upload, ChevronRight,
  CloudUpload, Loader2, PartyPopper, X
} from 'lucide-react';
import { incubationService } from '@/lib/incubationService';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { key: 'startup', label: 'Startup Information', icon: Rocket },
  { key: 'founder', label: 'Founder Information', icon: Users },
  { key: 'business', label: 'Business Information', icon: Coins },
  { key: 'documents', label: 'Supporting Documents', icon: FileText }
];

const docSlots = [
  { key: 'pitch_deck', label: 'Pitch Deck', hint: 'PDF (Max 10MB)' },
  { key: 'business_plan', label: 'Business Plan', hint: 'DOCX/PDF (Max 15MB)' },
  { key: 'financials', label: 'Financial Documents', hint: 'PDF/XLSX (Max 10MB)' },
  { key: 'registration', label: 'Registration Certificate', hint: 'PDF (Max 5MB)' }
];

const inputCls = 'w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors';
const labelCls = 'block text-sm font-medium text-slate-700 mb-1.5';

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-semibold text-slate-900">{children}</h3>
    </div>
  );
}

function UploadCard({ slot, file, progress, uploading, onFile, onRemove }) {
  const inputRef = useRef(null);
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(slot.key, f); }}
      className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
          {file ? <Check className="w-5 h-5 text-emerald-500" /> : <CloudUpload className="w-5 h-5 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-700">{slot.label}</p>
          <p className="text-xs text-slate-400">{file ? file.name : slot.hint}</p>
        </div>
        {file ? (
          <button onClick={() => onRemove(slot.key)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => inputRef.current?.click()} disabled={uploading} className="h-8 px-3 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-white disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Select File'}
          </button>
        )}
      </div>
      {uploading && (
        <div className="mt-3 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-slate-900 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) onFile(slot.key, f); }} />
    </div>
  );
}

export default function ApplyIncubator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [incubator, setIncubator] = useState(null);
  const [form, setForm] = useState({
    startup_name: '', industry: '', development_stage: 'Ideation', problem_statement: '', solution: '',
    founder_names: '', roles: '', team_size: '',
    website: '', pitch_deck_url: '', market_traction: '', revenue: '', users: '', milestones: ''
  });
  const [uploads, setUploads] = useState({});
  const [uploadingKey, setUploadingKey] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('startup');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    incubationService.getIncubator(id).then(setIncubator).catch(() => {});
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const sectionCompletion = {
    startup: form.startup_name && form.industry && form.problem_statement && form.solution,
    founder: form.founder_names && form.team_size,
    business: form.website && form.market_traction,
    documents: Object.keys(uploads).length >= 2
  };

  const completedCount = Object.values(sectionCompletion).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / 4) * 100);

  const handleFile = async (key, file) => {
    setUploadingKey(key);
    setProgress(0);
    const interval = setInterval(() => setProgress((p) => Math.min(p + 15, 90)), 120);
    try {
      const url = await incubationService.uploadDocument(file);
      clearInterval(interval);
      setProgress(100);
      setUploads((u) => ({ ...u, [key]: { name: file.name, type: file.name.split('.').pop().toUpperCase(), url, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) } }));
      toast({ title: 'Uploaded', description: `${file.name} uploaded successfully.` });
    } catch {
      clearInterval(interval);
      toast({ title: 'Upload failed', description: 'Could not upload file.', variant: 'destructive' });
    } finally {
      setTimeout(() => { setUploadingKey(null); setProgress(0); }, 400);
    }
  };

  const removeFile = (key) => setUploads((u) => { const c = { ...u }; delete c[key]; return c; });

  const handleSubmit = async () => {
    if (!sectionCompletion.startup || !sectionCompletion.founder) {
      toast({ title: 'Incomplete', description: 'Please complete Startup and Founder sections.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const docs = Object.entries(uploads).map(([k, v]) => ({ name: v.name, type: v.type, url: v.url, date: v.date }));
    const payload = {
      ...form,
      incubator_id: id,
      incubator_name: incubator?.name || '',
      status: 'submitted',
      current_stage: 'Submitted',
      applied_date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      reviewer: 'Sarah Jenkins',
      expected_decision: new Date(Date.now() + 21 * 86400000).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      documents: docs,
      program_name: incubator?.program_type || 'Incubation Program',
      duration: '6 Months',
      contact_person: incubator?.contact_person || 'Program Lead',
      contact_email: incubator?.contact_email || 'contact@incubator.com',
      contact_phone: incubator?.contact_phone || '',
      contact_website: incubator?.website || ''
    };
    try {
      await incubationService.applyToIncubator(payload);
      setShowSuccess(true);
      setTimeout(() => navigate('/my-incubation'), 2200);
    } catch {
      toast({ title: 'Error', description: 'Could not submit application.', variant: 'destructive' });
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await incubationService.applyToIncubator({ ...form, incubator_id: id, incubator_name: incubator?.name || '', status: 'draft', current_stage: 'Draft' });
      toast({ title: 'Draft saved', description: 'Your progress has been saved.' });
    } catch {
      toast({ title: 'Error', description: 'Could not save draft.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-2">
          <Link to="/incubators" className="hover:text-slate-700">Incubators</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/incubators/${id}`} className="hover:text-slate-700">{incubator?.name || 'Incubator'}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-700">Apply</span>
        </nav>
        <h1 className="text-2xl font-bold text-slate-900">Apply for Incubation</h1>
        <p className="mt-1 text-sm text-slate-500">Complete your application to join this incubation program.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1 */}
          <section onFocus={() => setActiveSection('startup')} className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionTitle icon={Rocket}>Startup Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Startup Name</label>
                <input className={inputCls} placeholder="Enter legal or brand name" value={form.startup_name} onChange={(e) => set('startup_name', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Development Stage</label>
                <select className={inputCls} value={form.development_stage} onChange={(e) => set('development_stage', e.target.value)}>
                  {['Ideation', 'MVP', 'Seed', 'Growth'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Industry</label>
                <input className={inputCls} placeholder="e.g. Fintech, EdTech, HealthTech" value={form.industry} onChange={(e) => set('industry', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Problem Statement</label>
                <textarea rows={3} className={inputCls + ' h-auto py-2.5'} placeholder="What specific problem are you solving?" value={form.problem_statement} onChange={(e) => set('problem_statement', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Proposed Solution</label>
                <textarea rows={3} className={inputCls + ' h-auto py-2.5'} placeholder="Describe your product and how it solves the problem." value={form.solution} onChange={(e) => set('solution', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section onFocus={() => setActiveSection('founder')} className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionTitle icon={Users}>Founder Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Core Founders</label>
                <textarea rows={3} className={inputCls + ' h-auto py-2.5'} placeholder="Names and roles of primary founders (e.g., John Doe - CEO)" value={form.founder_names} onChange={(e) => set('founder_names', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Roles</label>
                <input className={inputCls} placeholder="CTO, CMO, etc." value={form.roles} onChange={(e) => set('roles', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Current Team Size</label>
                <input className={inputCls} placeholder="Total number of team" value={form.team_size} onChange={(e) => set('team_size', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section onFocus={() => setActiveSection('business')} className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionTitle icon={Coins}>Business Information</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Website URL</label>
                <input className={inputCls} placeholder="https://yourstartup.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Pitch Deck Link</label>
                <input className={inputCls} placeholder="https://link-to-your-deck.com" value={form.pitch_deck_url} onChange={(e) => set('pitch_deck_url', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Market Traction</label>
                <textarea rows={3} className={inputCls + ' h-auto py-2.5'} placeholder="Describe users, revenue, or milestones achieved to date." value={form.market_traction} onChange={(e) => set('market_traction', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Revenue</label>
                <input className={inputCls} placeholder="e.g. $10k MRR" value={form.revenue} onChange={(e) => set('revenue', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Users</label>
                <input className={inputCls} placeholder="e.g. 1,200 active" value={form.users} onChange={(e) => set('users', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Milestones</label>
                <input className={inputCls} placeholder="Key achievements to date" value={form.milestones} onChange={(e) => set('milestones', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section onFocus={() => setActiveSection('documents')} className="rounded-xl border border-slate-200 bg-white p-6">
            <SectionTitle icon={FileText}>Supporting Documents</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              {docSlots.map((slot) => (
                <UploadCard
                  key={slot.key}
                  slot={slot}
                  file={uploads[slot.key]}
                  uploading={uploadingKey === slot.key}
                  progress={uploadingKey === slot.key ? progress : 0}
                  onFile={handleFile}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 lg:sticky lg:top-20">
            <h4 className="font-semibold text-slate-900 text-sm mb-4">Application Checklist</h4>
            <div className="space-y-3">
              {sections.map((s) => {
                const done = sectionCompletion[s.key];
                const active = activeSection === s.key;
                const Icon = s.icon;
                return (
                  <div key={s.key} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${active ? 'bg-slate-50' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500 text-white' : active ? 'bg-slate-900 text-white' : 'border-2 border-slate-200'}`}>
                      {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3 h-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{s.label}</p>
                      <p className="text-[11px] text-slate-400">{done ? 'Completed' : active ? 'In Progress' : 'Pending'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5"><span>Overall Progress</span><span>{overallProgress}%</span></div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-900 text-white p-5">
            <p className="text-xs font-bold tracking-widest text-amber-400 mb-2">NOTICE</p>
            <p className="text-sm text-slate-300 leading-relaxed">Once submitted, you cannot edit your application until the initial review phase is complete. Please double-check all fields.</p>
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="sticky bottom-0 mt-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/90 backdrop-blur border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs text-slate-400 hidden sm:block">Draft auto-saved {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <div className="flex gap-2.5 ml-auto">
          <button onClick={handleSaveDraft} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="h-10 px-5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60 inline-flex items-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit Application
          </button>
        </div>
      </div>

      {/* Success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-emerald-100 mx-auto flex items-center justify-center mb-4"
              >
                <PartyPopper className="w-8 h-8 text-emerald-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
              <p className="mt-2 text-sm text-slate-500">Redirecting you to your incubation dashboard…</p>
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin mx-auto mt-4" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}