import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Link2, Code2, FileText, CalendarDays, Download, Send } from 'lucide-react';
import CompanyShell from '@/components/company/CompanyShell';
import PlaceholderGraphic from '@/components/ui/PlaceholderGraphic';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const SKILLS = ['Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker'];
const STATUS_OPTIONS = ['Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

export default function ApplicantDetailPage() {
  useDocumentTitle('Alex Rivera — Applicant Detail — BOCC');
  const [status, setStatus] = useState('Shortlisted');
  const [notes, setNotes] = useState('');

  return (
    <CompanyShell>
      <Link to="/company/applicants" className="inline-flex items-center gap-2 text-text-muted hover:text-text-heading transition-colors font-inter text-small mb-6">
        <ArrowLeft size={16} strokeWidth={2} /> Return to Applicants List
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-brand-black text-white flex items-center justify-center font-poppins font-bold text-page mb-4">
              AR
            </div>
            <h3 className="font-poppins font-semibold text-card text-text-heading mb-1">Alex Rivera</h3>
            <p className="font-inter font-bold text-small text-text-heading">Stanford University</p>
            <p className="font-inter text-small text-text-muted mb-4">BS Computer Science, 2024</p>
            <div className="w-full pt-4 border-t border-divider-line flex flex-col gap-3 text-left">
              <div className="flex items-center gap-2 font-inter text-caption text-text-body">
                <Mail size={16} strokeWidth={2} className="text-text-muted" /> alex.rivera@stanford.edu
              </div>
              <div className="flex items-center gap-2 font-inter text-caption text-text-body">
                <Phone size={16} strokeWidth={2} className="text-text-muted" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-3 justify-center mt-2">
                <ComingSoon label="Portfolio Link" position="top" inline className="w-8 h-8 rounded bg-canvas-bg border border-border-subtle flex items-center justify-center">
                  <Link2 size={16} strokeWidth={2} className="text-text-heading" />
                </ComingSoon>
                <ComingSoon label="GitHub Profile" position="top" inline className="w-8 h-8 rounded bg-canvas-bg border border-border-subtle flex items-center justify-center">
                  <Code2 size={16} strokeWidth={2} className="text-text-heading" />
                </ComingSoon>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-3 pb-1 border-b border-divider-line">About</h4>
            <p className="font-inter text-small text-text-body leading-relaxed">
              Passionate software engineer with a strong foundation in full-stack development and artificial intelligence. Excited about building scalable products in the early-stage startup ecosystem. Previous experience includes internships at high-growth fintech companies.
            </p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-3 pb-1 border-b border-divider-line">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => <span key={s} className="px-3 py-1 bg-canvas-bg rounded font-inter text-small text-text-heading">{s}</span>)}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-divider-line">
              <h4 className="font-poppins font-semibold text-body text-text-heading">Resume Preview</h4>
            </div>
            <PlaceholderGraphic icon={FileText} label="Resume preview" className="aspect-[1/1.3] w-full rounded-lg" />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 sticky top-24">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Recruiter Actions</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-caption font-bold text-text-muted font-inter">Application Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter min-h-[40px] px-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all">
                  {STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-caption font-bold text-text-muted font-inter">Internal Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add a private note..." className="w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all resize-none" />
              </div>
              <div className="space-y-2 pt-2">
                <ComingSoon label="Schedule Interview" position="left" className="w-full">
                  <span className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-black text-white rounded-lg font-inter font-bold text-small">
                    <CalendarDays size={16} strokeWidth={2} /> Schedule Interview
                  </span>
                </ComingSoon>
                <ComingSoon label="Download Resume" position="left" className="w-full">
                  <span className="w-full flex items-center justify-center gap-2 py-2.5 border border-border-subtle rounded-lg font-inter font-bold text-small text-text-heading">
                    <Download size={16} strokeWidth={2} /> Download Resume
                  </span>
                </ComingSoon>
                <ComingSoon label="Contact Applicant" position="left" className="w-full">
                  <span className="w-full flex items-center justify-center gap-2 py-2.5 border border-border-subtle rounded-lg font-inter font-bold text-small text-text-heading">
                    <Send size={16} strokeWidth={2} /> Contact Applicant
                  </span>
                </ComingSoon>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <ComingSoon label="Reject Applicant" position="top" className="w-full">
                  <span className="w-full flex items-center justify-center py-2 border border-error/40 text-error rounded font-inter font-medium text-caption">Reject</span>
                </ComingSoon>
                <ComingSoon label="Share Profile" position="top" className="w-full">
                  <span className="w-full flex items-center justify-center py-2 border border-border-subtle text-text-heading rounded font-inter font-medium text-caption">Share Profile</span>
                </ComingSoon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CompanyShell>
  );
}
